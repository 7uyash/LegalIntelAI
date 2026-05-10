from fastapi import UploadFile
from pathlib import Path
import aiofiles
from app.config import settings
import PyPDF2
import base64
import httpx

try:
    import fitz
except ImportError:  # pragma: no cover - optional runtime dependency
    fitz = None


class FileService:
    @staticmethod
    async def save_upload_file(file: UploadFile) -> str:
        """Save uploaded file and return path"""
        # Create upload directory if it doesn't exist
        Path(settings.UPLOAD_DIR).mkdir(exist_ok=True)
        
        # Generate unique filename
        file_path = Path(settings.UPLOAD_DIR) / file.filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return str(file_path)
    
    @staticmethod
    async def extract_text_from_pdf(file_path: str) -> dict:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                text = ""
                num_pages = len(pdf_reader.pages)
                page_text_lengths = []
                
                for page_num in range(num_pages):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text() or ""
                    page_text_lengths.append(len(page_text.strip()))
                    text += page_text + "\n"

                ocr_result = None
                if FileService._needs_ocr(text, page_text_lengths):
                    ocr_result = await FileService._extract_text_with_gemini_ocr(file_path)
                    if ocr_result.get("success") and ocr_result.get("text"):
                        text = ocr_result["text"]
                
                return {
                    "success": True,
                    "text": text,
                    "pages": num_pages,
                    "file_path": file_path,
                    "extraction_method": "gemini_ocr" if ocr_result and ocr_result.get("success") else "embedded_text",
                    "ocr_used": bool(ocr_result and ocr_result.get("success")),
                    "ocr_status": ocr_result.get("status") if ocr_result else "not_needed",
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    @staticmethod
    def _needs_ocr(text: str, page_text_lengths: list[int]) -> bool:
        if not settings.GEMINI_API_KEY or "paste_" in settings.GEMINI_API_KEY.lower():
            return False
        if not page_text_lengths:
            return True
        average_chars = sum(page_text_lengths) / max(len(page_text_lengths), 1)
        return len(text.strip()) < 250 or average_chars < 120

    @staticmethod
    async def _extract_text_with_gemini_ocr(file_path: str) -> dict:
        """OCR scanned PDF pages using Gemini Vision."""
        if fitz is None:
            return {
                "success": False,
                "status": "pymupdf_not_installed",
            }

        try:
            document = fitz.open(file_path)
            page_text = []
            max_pages = min(len(document), 8)

            for page_index in range(max_pages):
                page = document.load_page(page_index)
                pixmap = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
                image_bytes = pixmap.tobytes("png")
                extracted = await FileService._ocr_image_with_gemini(image_bytes, page_index + 1)
                if extracted:
                    page_text.append(f"[OCR page {page_index + 1}]\n{extracted}")

            if not page_text:
                return {
                    "success": False,
                    "status": "no_ocr_text_returned",
                }

            return {
                "success": True,
                "status": "completed",
                "text": "\n\n".join(page_text),
                "pages_ocr_processed": max_pages,
            }
        except Exception as e:
            return {
                "success": False,
                "status": "ocr_failed",
                "error": str(e),
            }

    @staticmethod
    async def _ocr_image_with_gemini(image_bytes: bytes, page_number: int) -> str:
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                "Extract all readable legal document text from this page. "
                                f"Preserve clauses, party names, dates, amounts, and headings. Page {page_number}."
                            )
                        },
                        {
                            "inline_data": {
                                "mime_type": "image/png",
                                "data": base64.b64encode(image_bytes).decode("utf-8"),
                            }
                        },
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0,
                "maxOutputTokens": 2000,
            },
        }

        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                url,
                params={"key": settings.GEMINI_API_KEY},
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

        candidates = data.get("candidates", [])
        if not candidates:
            return ""
        parts = candidates[0].get("content", {}).get("parts", [])
        return "\n".join(part.get("text", "") for part in parts).strip()
    
    @staticmethod
    async def get_file_info(file_path: str) -> dict:
        """Get file information"""
        try:
            path = Path(file_path)
            if path.exists():
                return {
                    "filename": path.name,
                    "size": path.stat().st_size,
                    "exists": True
                }
        except Exception as e:
            return {
                "error": str(e),
                "exists": False
            }
