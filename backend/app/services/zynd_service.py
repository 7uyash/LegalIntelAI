from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from app.config import settings


class ZyndService:
    """Zynd-facing metadata and webhook handling."""

    def agent_card(self) -> Dict[str, Any]:
        base_url = settings.ZYND_AGENT_URL.rstrip("/")
        return {
            "name": settings.ZYND_AGENT_NAME,
            "description": "Autonomous legal intelligence agent for document analysis, evidence gathering, contradiction detection, and risk scoring.",
            "category": "legal-intelligence",
            "version": settings.API_VERSION,
            "url": base_url,
            "endpoints": {
                "health": f"{base_url}/health",
                "sync_webhook": f"{base_url}/webhook/sync",
                "upload": f"{base_url}/api/upload",
                "analyze": f"{base_url}/api/analyze/{{file_id}}",
            },
            "capabilities": [
                "pdf_text_extraction",
                "legal_document_analysis",
                "entity_extraction",
                "apify_web_evidence_collection",
                "contradiction_detection",
                "timeline_reconstruction",
                "risk_assessment",
                "report_generation",
            ],
            "integrations": ["Zynd AI", "Apify", "Superplane", "OpenAI"],
            "tags": ["legal", "agents", "investigation", "apify", "superplane"],
            "status": "ready",
            "generated_at": datetime.now().isoformat(),
        }

    def status(self) -> Dict[str, Any]:
        return {
            "enabled": settings.ZYND_ENABLED,
            "registry_url": settings.ZYND_REGISTRY_URL,
            "agent_name": settings.ZYND_AGENT_NAME,
            "agent_url": settings.ZYND_AGENT_URL,
            "agent_card": "/.well-known/agent.json",
            "sync_webhook": "/webhook/sync",
            "deployment_note": "Run `zynd agent run` or deploy the zynd-agent folder to deployer.zynd.ai for live registry presence.",
        }

    async def handle_sync(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        content = str(payload.get("content") or payload.get("message") or "")
        return {
            "agent": settings.ZYND_AGENT_NAME,
            "received": payload,
            "content_summary": content[:300] if content else "No content supplied.",
            "recommended_action": "Upload a PDF through /api/upload, then call /api/analyze/{file_id} for autonomous investigation.",
            "status": "acknowledged",
            "timestamp": datetime.now().isoformat(),
        }
