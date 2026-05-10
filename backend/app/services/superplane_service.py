from __future__ import annotations

from typing import Any, Dict, List

from app.config import settings


class SuperplaneService:
    """Describes how Superplane can orchestrate the deployed agent workflow."""

    def status(self) -> Dict[str, Any]:
        return {
            "enabled": settings.SUPERPLANE_ENABLED,
            "canvas_name": settings.SUPERPLANE_CANVAS_NAME,
            "workflow_file": ".superplane/legalintel-agent-workflow.yaml",
            "purpose": "Coordinate upload, analysis, review gates, and deployment audit trail.",
        }

    def workflow_preview(self) -> Dict[str, Any]:
        nodes: List[Dict[str, Any]] = [
            {
                "name": "Manual Submission Trigger",
                "type": "manual_run",
                "description": "Judge or operator starts a legal document review workflow.",
            },
            {
                "name": "Upload Document",
                "type": "http_request",
                "description": "POST PDF to LegalIntel /api/upload.",
            },
            {
                "name": "Run Agent Analysis",
                "type": "http_request",
                "description": "POST /api/analyze/{file_id}; includes OpenAI, Apify, Zynd-compatible agent orchestration.",
            },
            {
                "name": "Risk Gate",
                "type": "if",
                "description": "Branch on risk score for human review or auto-report generation.",
            },
            {
                "name": "Generate Report",
                "type": "http_request",
                "description": "POST /api/reports/{file_id} and archive report metadata.",
            },
        ]
        return {
            "name": settings.SUPERPLANE_CANVAS_NAME,
            "nodes": nodes,
            "message_chain_keys": [
                "$['Upload Document'].data.body.file_id",
                "$['Run Agent Analysis'].data.body.risk.score",
                "$['Run Agent Analysis'].data.body.integrations.apify.mode",
            ],
        }
