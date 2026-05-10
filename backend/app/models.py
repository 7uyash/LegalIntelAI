from pydantic import BaseModel
from typing import Optional, List


class UploadResponse(BaseModel):
    success: bool
    filename: str
    pages: int
    entities: int
    file_id: str
    message: Optional[str] = None


class AnalysisRequest(BaseModel):
    file_id: str
    analyze_text: bool = True
    extract_entities: bool = True
    generate_report: bool = True


class AnalysisResponse(BaseModel):
    success: bool
    file_id: str
    analysis: Optional[dict] = None
    entities: Optional[dict] = None
    report: Optional[dict] = None
    timestamp: str


class ReportRequest(BaseModel):
    file_id: str


class ReportResponse(BaseModel):
    success: bool
    report_id: str
    content: dict
    generated_at: str
    file_id: str


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
