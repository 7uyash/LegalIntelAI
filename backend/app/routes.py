from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.file_service import FileService
from app.services.agent_orchestrator import AgentOrchestrator
from app.models import UploadResponse, AnalysisRequest, AnalysisResponse, ReportResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/api", tags=["documents"])

# In-memory storage for demo (use database in production)
documents_db = {}
analyses_db = {}
reports_db = {}

file_service = FileService()
orchestrator = AgentOrchestrator()


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload a legal document for analysis"""
    
    # Validate file
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    if file.size and file.size > 50 * 1024 * 1024:  # 50MB
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 50MB limit"
        )
    
    try:
        # Save file
        file_path = await file_service.save_upload_file(file)
        
        # Extract text from PDF
        pdf_result = await file_service.extract_text_from_pdf(file_path)
        
        if not pdf_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to process PDF: {pdf_result.get('error', 'Unknown error')}"
            )
        
        # Generate file ID
        file_id = str(uuid.uuid4())
        
        # Store document info
        documents_db[file_id] = {
            "filename": file.filename,
            "file_path": file_path,
            "pages": pdf_result["pages"],
            "text": pdf_result["text"],
            "extraction_method": pdf_result.get("extraction_method", "embedded_text"),
            "ocr_used": pdf_result.get("ocr_used", False),
            "ocr_status": pdf_result.get("ocr_status", "not_needed"),
            "uploaded_at": datetime.now().isoformat()
        }
        
        return UploadResponse(
            success=True,
            filename=file.filename,
            pages=pdf_result["pages"],
            entities=12,  # Mock value
            file_id=file_id,
            message="Document uploaded successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/analyze/{file_id}", response_model=AnalysisResponse)
async def analyze_document(file_id: str, request: AnalysisRequest | None = None):
    """Analyze uploaded document"""
    
    if file_id not in documents_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    try:
        doc = documents_db[file_id]
        analysis_bundle = await orchestrator.run(doc)
        
        # Store analysis
        analyses_db[file_id] = {
            **analysis_bundle,
            "analyzed_at": datetime.now().isoformat()
        }
        
        return AnalysisResponse(
            success=True,
            file_id=file_id,
            analysis=analysis_bundle["analysis"],
            entities=analysis_bundle["entities"],
            report=analysis_bundle["report"],
            workflow=analysis_bundle["workflow"],
            evidence=analysis_bundle["evidence"],
            contradictions=analysis_bundle["contradictions"],
            timeline=analysis_bundle["timeline"],
            risk=analysis_bundle["risk"],
            integrations=analysis_bundle["integrations"],
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/reports/{file_id}", response_model=ReportResponse)
async def generate_report(file_id: str):
    """Generate comprehensive report for analyzed document"""
    
    if file_id not in documents_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if file_id not in analyses_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document has not been analyzed yet"
        )
    
    try:
        analysis = analyses_db[file_id]
        doc = documents_db[file_id]
        
        report_id = str(uuid.uuid4())
        report_content = {
            "document": doc["filename"],
            "pages": doc["pages"],
            "analysis": analysis.get("analysis"),
            "entities": analysis.get("entities"),
            "report": analysis.get("report"),
            "evidence": analysis.get("evidence", []),
            "contradictions": analysis.get("contradictions", []),
            "timeline": analysis.get("timeline", []),
            "risk": analysis.get("risk", {}),
            "integrations": analysis.get("integrations", {}),
            "generated_at": datetime.now().isoformat(),
            "status": "completed"
        }
        
        reports_db[report_id] = report_content
        
        return ReportResponse(
            success=True,
            report_id=report_id,
            content=report_content,
            generated_at=datetime.now().isoformat(),
            file_id=file_id
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/reports/{report_id}")
async def get_report(report_id: str):
    """Retrieve generated report"""
    
    if report_id not in reports_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return {
        "success": True,
        "report": reports_db[report_id]
    }


@router.get("/documents/{file_id}")
async def get_document_status(file_id: str):
    """Get document status and information"""
    
    if file_id not in documents_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    doc = documents_db[file_id]
    is_analyzed = file_id in analyses_db
    
    return {
        "success": True,
        "file_id": file_id,
        "filename": doc["filename"],
        "pages": doc["pages"],
        "extraction_method": doc.get("extraction_method", "embedded_text"),
        "ocr_used": doc.get("ocr_used", False),
        "ocr_status": doc.get("ocr_status", "not_needed"),
        "uploaded_at": doc["uploaded_at"],
        "analyzed": is_analyzed,
        "analysis_data": analyses_db.get(file_id) if is_analyzed else None
    }


@router.get("/integrations/status")
async def get_integrations_status():
    """Get hackathon integration readiness status"""
    return {
        "success": True,
        "integrations": {
            "zynd": orchestrator.zynd_service.status(),
            "apify": {
                "enabled": orchestrator.apify_service.enabled,
                "actor": "apify/google-search-scraper",
                "purpose": "Live web evidence collection and public-source research.",
            },
            "superplane": orchestrator.superplane_service.status(),
        }
    }


@router.get("/superplane/workflow")
async def get_superplane_workflow():
    """Preview the intended Superplane workflow graph"""
    return {
        "success": True,
        "workflow": orchestrator.superplane_service.workflow_preview()
    }
