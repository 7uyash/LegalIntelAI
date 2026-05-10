from __future__ import annotations

from typing import Any, Dict, List
from urllib.parse import quote

import httpx

from app.config import settings


class ApifyService:
    """Evidence collection through Apify, with deterministic fallback data."""

    def __init__(self) -> None:
        self.enabled = self._has_real_token(settings.APIFY_API_TOKEN)

    async def collect_evidence(self, entities: Dict[str, Any], text: str) -> Dict[str, Any]:
        queries = self._build_queries(entities, text)

        if not self.enabled:
            return {
                "provider": "apify",
                "mode": "mock",
                "enabled": False,
                "queries": queries,
                "items": self._mock_items(queries),
                "message": "Set APIFY_API_TOKEN to run live Apify actor evidence collection.",
            }

        try:
            items = await self._run_search_actor(queries)
            return {
                "provider": "apify",
                "mode": "live",
                "enabled": True,
                "queries": queries,
                "items": items,
                "message": "Live evidence collected through Apify.",
            }
        except Exception as exc:
            return {
                "provider": "apify",
                "mode": "fallback",
                "enabled": True,
                "queries": queries,
                "items": self._mock_items(queries),
                "message": "Apify live run failed, using fallback evidence. Check APIFY_API_TOKEN and actor access.",
            }

    async def _run_search_actor(self, queries: List[str]) -> List[Dict[str, Any]]:
        actor_id = quote(settings.APIFY_SEARCH_ACTOR_ID, safe="")
        url = (
            f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items"
            f"?token={settings.APIFY_API_TOKEN}"
        )
        run_input = {
            "queries": "\n".join(queries),
            "resultsPerPage": max(1, settings.APIFY_MAX_RESULTS),
            "maxPagesPerQuery": 1,
            "countryCode": "us",
            "languageCode": "en",
        }

        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(url, json=run_input)
            response.raise_for_status()
            raw_items = response.json()

        normalized: List[Dict[str, Any]] = []
        for item in raw_items[: settings.APIFY_MAX_RESULTS * max(1, len(queries))]:
            title = item.get("title") or item.get("name") or item.get("url") or "Apify result"
            url_value = item.get("url") or item.get("link") or item.get("displayedUrl")
            snippet = item.get("description") or item.get("text") or item.get("snippet") or ""
            normalized.append({
                "title": title,
                "url": url_value,
                "snippet": snippet[:500],
                "source": "Apify",
                "relevance": self._score_relevance(title, snippet),
            })

        return normalized

    def _build_queries(self, entities: Dict[str, Any], text: str) -> List[str]:
        names: List[str] = []
        parties = entities.get("parties") if isinstance(entities, dict) else []
        if isinstance(parties, list):
            for party in parties:
                if isinstance(party, dict) and party.get("name"):
                    names.append(str(party["name"]))
                elif isinstance(party, str):
                    names.append(party)

        if not names:
            words = [word.strip(".,:;()[]") for word in text.split()]
            capitalized = [word for word in words if len(word) > 3 and word[:1].isupper()]
            names = capitalized[:3] or ["legal dispute"]

        return [f"{name} legal filings news compliance" for name in names[:3]]

    @staticmethod
    def _score_relevance(title: str, snippet: str) -> float:
        content = f"{title} {snippet}".lower()
        score = 0.55
        for keyword in ("court", "legal", "filing", "fraud", "contract", "regulatory", "compliance"):
            if keyword in content:
                score += 0.06
        return min(score, 0.95)

    @staticmethod
    def _mock_items(queries: List[str]) -> List[Dict[str, Any]]:
        return [
            {
                "title": f"Public record search prepared for: {query}",
                "url": "https://example.com/public-record-placeholder",
                "snippet": "Demo evidence item. Configure APIFY_API_TOKEN to replace this with live web evidence.",
                "source": "Apify fallback",
                "relevance": 0.72,
            }
            for query in queries[:3]
        ]

    @staticmethod
    def _has_real_token(value: str) -> bool:
        if not value:
            return False
        lowered = value.lower()
        return not any(marker in lowered for marker in ("paste_", "your-", "your_"))
