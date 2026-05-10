from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI, Request

app = FastAPI(title="LegalIntel Zynd Agent")


@app.get("/health")
async def health() -> Dict[str, str]:
    return {
        "status": "healthy",
        "agent": "legalintel-investigator",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/.well-known/agent.json")
async def agent_card() -> Dict[str, Any]:
    return {
        "name": "legalintel-investigator",
        "description": "Autonomous legal intelligence agent for PDF analysis, Apify evidence collection, contradiction detection, timeline reconstruction, and risk scoring.",
        "category": "legal-intelligence",
        "capabilities": [
            "legal_document_analysis",
            "apify_evidence_collection",
            "contradiction_detection",
            "timeline_reconstruction",
            "risk_assessment",
            "superplane_workflow_audit",
        ],
        "webhook": "/webhook/sync",
        "status": "ready",
    }


@app.post("/webhook/sync")
async def sync_webhook(request: Request) -> Dict[str, Any]:
    payload = await request.json()
    return {
        "agent": "legalintel-investigator",
        "status": "acknowledged",
        "received": payload,
        "next_step": "Call the main LegalIntel backend /api/upload then /api/analyze/{file_id}.",
        "timestamp": datetime.now().isoformat(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
