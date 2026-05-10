from fastapi import UploadFile
from pathlib import Path
import aiofiles
from app.config import settings
import PyPDF2
import io


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
                
                for page_num in range(num_pages):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"
                
                return {
                    "success": True,
                    "text": text,
                    "pages": num_pages,
                    "file_path": file_path
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
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
