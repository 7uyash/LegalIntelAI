from pydantic import BaseModel
from typing import Optional, List, Dict, Any


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
    include_web_investigation: bool = True
    include_contradiction_detection: bool = True
    include_timeline: bool = True
    include_risk_assessment: bool = True


class AgentStep(BaseModel):
    name: str
    status: str
    summary: str
    provider: str
    artifacts: Optional[List[dict]] = None


class AnalysisResponse(BaseModel):
    success: bool
    file_id: str
    analysis: Optional[dict] = None
    entities: Optional[dict] = None
    report: Optional[dict] = None
    workflow: Optional[List[AgentStep]] = None
    evidence: Optional[List[dict]] = None
    contradictions: Optional[List[dict]] = None
    timeline: Optional[List[dict]] = None
    risk: Optional[dict] = None
    integrations: Optional[Dict[str, Any]] = None
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
