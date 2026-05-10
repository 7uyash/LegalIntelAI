from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List

from app.services.ai_service import AIService
from app.services.apify_service import ApifyService
from app.services.superplane_service import SuperplaneService
from app.services.zynd_service import ZyndService


class AgentOrchestrator:
    """Coordinates the autonomous legal investigation workflow."""

    def __init__(self) -> None:
        self.ai_service = AIService()
        self.apify_service = ApifyService()
        self.zynd_service = ZyndService()
        self.superplane_service = SuperplaneService()

    async def run(self, document: Dict[str, Any]) -> Dict[str, Any]:
        text = document.get("text", "")
        workflow: List[Dict[str, Any]] = []

        workflow.append(self._step(
            "Orchestrator Agent",
            "completed",
            "Document accepted, text extracted, and specialized agents dispatched.",
            "LegalIntel",
            [{"filename": document.get("filename"), "pages": document.get("pages")}],
        ))

        analysis_result = await self.ai_service.analyze_legal_document(text)
        analysis = analysis_result.get("data") or analysis_result
        workflow.append(self._step(
            "Legal Research Agent",
            "completed",
            "Identified legal issues, obligations, parties, and compliance areas.",
            self._provider_label(analysis_result),
            [analysis],
        ))

        entities_result = await self.ai_service.extract_entities(text)
        entities = entities_result.get("data") or entities_result
        workflow.append(self._step(
            "Entity Extraction Agent",
            "completed",
            "Extracted parties, dates, amounts, and legal entities for investigation.",
            self._provider_label(entities_result),
            [entities],
        ))

        evidence_result = await self.apify_service.collect_evidence(entities, text)
        evidence_items = evidence_result.get("items", [])
        workflow.append(self._step(
            "Evidence Collection Agent",
            "completed",
            evidence_result.get("message", "Evidence collection completed."),
            "Apify",
            evidence_items,
        ))

        contradictions = self._detect_contradictions(text, analysis, entities)
        workflow.append(self._step(
            "Contradiction Detection Agent",
            "completed",
            f"Flagged {len(contradictions)} potential contradiction or missing-context issue(s).",
            "LegalIntel",
            contradictions,
        ))

        timeline = self._build_timeline(text, entities)
        workflow.append(self._step(
            "Timeline Reconstruction Agent",
            "completed",
            f"Built a chronological timeline with {len(timeline)} event(s).",
            "LegalIntel",
            timeline,
        ))

        risk = self._assess_risk(analysis, contradictions, evidence_items)
        workflow.append(self._step(
            "Risk Assessment Agent",
            "completed",
            f"Overall risk assessed as {risk['overall_risk']} with score {risk['score']}/100.",
            "LegalIntel",
            [risk],
        ))

        report_result = await self.ai_service.generate_report(str(analysis), str(entities))
        report = report_result.get("data") or report_result
        report = self._merge_report(report, evidence_items, contradictions, timeline, risk)
        workflow.append(self._step(
            "Report Generation Agent",
            "completed",
            "Generated a structured legal intelligence report.",
            self._provider_label(report_result),
            [report],
        ))

        return {
            "analysis": analysis,
            "entities": entities,
            "evidence": evidence_items,
            "contradictions": contradictions,
            "timeline": timeline,
            "risk": risk,
            "report": report,
            "workflow": workflow,
            "integrations": {
                "llm": {
                    "provider": self.ai_service.provider,
                    "model": self._llm_model_name(),
                    "mode": "live" if self.ai_service.provider in {"gemini", "openai"} else "mock",
                },
                "zynd": self.zynd_service.status(),
                "apify": {
                    "enabled": evidence_result.get("enabled", False),
                    "mode": evidence_result.get("mode"),
                    "actor": evidence_result.get("provider"),
                    "queries": evidence_result.get("queries", []),
                },
                "superplane": self.superplane_service.status(),
            },
            "completed_at": datetime.now().isoformat(),
        }

    def _llm_model_name(self) -> str:
        if self.ai_service.provider == "gemini":
            from app.config import settings
            return settings.GEMINI_MODEL
        if self.ai_service.provider == "openai":
            from app.config import settings
            return settings.OPENAI_MODEL
        return "mock-legal-analysis"

    @staticmethod
    def _provider_label(result: Dict[str, Any]) -> str:
        provider = result.get("provider")
        if provider:
            return str(provider).replace("-", " ").title()
        if result.get("success"):
            return "LLM"
        return "Mock Fallback"

    @staticmethod
    def _step(
        name: str,
        status: str,
        summary: str,
        provider: str,
        artifacts: List[Dict[str, Any]] | None = None,
    ) -> Dict[str, Any]:
        return {
            "name": name,
            "status": status,
            "summary": summary,
            "provider": provider,
            "artifacts": artifacts or [],
        }

    @staticmethod
    def _detect_contradictions(
        text: str,
        analysis: Dict[str, Any],
        entities: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        issues: List[Dict[str, Any]] = []
        lower_text = text.lower()

        if "notwithstanding" in lower_text and "except" in lower_text:
            issues.append({
                "title": "Conditional obligation conflict",
                "severity": "medium",
                "description": "Document contains exception-heavy obligation language that should be manually reconciled.",
            })

        if "shall" in lower_text and "may" in lower_text:
            issues.append({
                "title": "Mandatory versus discretionary language",
                "severity": "low",
                "description": "Both mandatory and discretionary terms appear; confirm which duties are binding.",
            })

        dates = entities.get("dates") if isinstance(entities, dict) else []
        if isinstance(dates, list) and len(dates) > 1:
            normalized_dates = [
                item.get("date") for item in dates
                if isinstance(item, dict) and item.get("date")
            ]
            if len(normalized_dates) != len(set(normalized_dates)):
                issues.append({
                    "title": "Repeated date references",
                    "severity": "medium",
                    "description": "The same date appears in multiple contexts; verify whether these events are distinct.",
                })

        risks = analysis.get("risks") if isinstance(analysis, dict) else []
        if isinstance(risks, list) and not risks:
            issues.append({
                "title": "Missing risk section",
                "severity": "high",
                "description": "No explicit risk factors were extracted from the document.",
            })

        return issues or [{
            "title": "No major contradictions detected",
            "severity": "info",
            "description": "Automated checks did not find obvious internal contradictions. Human review is still recommended.",
        }]

    @staticmethod
    def _build_timeline(text: str, entities: Dict[str, Any]) -> List[Dict[str, Any]]:
        dates = entities.get("dates") if isinstance(entities, dict) else []
        timeline: List[Dict[str, Any]] = []

        if isinstance(dates, list):
            for item in dates:
                if isinstance(item, dict):
                    timeline.append({
                        "date": item.get("date", "Unknown date"),
                        "title": item.get("event", "Document event"),
                        "description": item.get("description", "Date extracted from the legal document."),
                        "type": "document",
                    })

        if not timeline:
            timeline.append({
                "date": datetime.now().date().isoformat(),
                "title": "Document analyzed",
                "description": "No explicit dated events were extracted; this marks the analysis timestamp.",
                "type": "analysis",
            })

        return sorted(timeline, key=lambda item: item.get("date", "9999"))

    @staticmethod
    def _assess_risk(
        analysis: Dict[str, Any],
        contradictions: List[Dict[str, Any]],
        evidence: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        score = 20
        risks = analysis.get("risks") if isinstance(analysis, dict) else []
        if isinstance(risks, list):
            score += min(len(risks) * 10, 30)

        severity_weight = {"high": 20, "medium": 12, "low": 6, "info": 0}
        score += sum(severity_weight.get(item.get("severity"), 4) for item in contradictions)
        score += min(len(evidence) * 3, 15)
        score = min(score, 100)

        if score >= 75:
            overall = "High"
        elif score >= 45:
            overall = "Medium"
        else:
            overall = "Low"

        return {
            "score": score,
            "overall_risk": overall,
            "critical_issues": len([item for item in contradictions if item.get("severity") == "high"]),
            "warnings": len([item for item in contradictions if item.get("severity") == "medium"]),
            "evidence_items": len(evidence),
            "recommendation": "Prioritize human legal review before relying on this document operationally.",
        }

    @staticmethod
    def _merge_report(
        report: Dict[str, Any],
        evidence: List[Dict[str, Any]],
        contradictions: List[Dict[str, Any]],
        timeline: List[Dict[str, Any]],
        risk: Dict[str, Any],
    ) -> Dict[str, Any]:
        if not isinstance(report, dict):
            report = {"summary": str(report)}

        report["evidence_findings"] = evidence
        report["contradiction_analysis"] = contradictions
        report["timeline"] = timeline
        report["risk_assessment"] = risk
        report["generated_by"] = "LegalIntel autonomous agent workflow"
        return report
