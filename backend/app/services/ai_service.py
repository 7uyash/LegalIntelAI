from app.config import settings
from openai import OpenAI
import httpx


class AIService:
    def __init__(self):
        self.client = None
        self.provider = self._select_provider()
        if self.provider == "openai" and settings.OPENAI_API_KEY:
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception:
                self.client = None

    @staticmethod
    def _select_provider() -> str:
        has_gemini_key = AIService._has_real_key(settings.GEMINI_API_KEY)
        has_openai_key = AIService._has_real_key(settings.OPENAI_API_KEY)

        if settings.LLM_PROVIDER in {"gemini", "openai", "mock"}:
            if settings.LLM_PROVIDER == "gemini" and not has_gemini_key:
                return "mock"
            if settings.LLM_PROVIDER == "openai" and not has_openai_key:
                return "mock"
            return settings.LLM_PROVIDER
        if has_gemini_key:
            return "gemini"
        if has_openai_key:
            return "openai"
        return "mock"

    @staticmethod
    def _has_real_key(value: str) -> bool:
        if not value:
            return False
        lowered = value.lower()
        return not any(marker in lowered for marker in ("paste_", "your-", "your_", "sk-your"))
    
    async def analyze_legal_document(self, text: str) -> dict:
        """Analyze legal document using OpenAI"""
        try:
            if self.provider == "gemini":
                content = await self._generate_with_gemini(
                    "You are an expert legal analyst. Analyze the provided legal document and extract key information.",
                    f"""Analyze this legal document and provide JSON-like sections for:
1. Key parties involved
2. Main contract obligations
3. Payment terms
4. Risk factors
5. Compliance requirements

Document text:
{text[:6000]}"""
                )
                return {
                    "success": True,
                    "provider": "gemini",
                    "analysis": content
                }

            if not self.client:
                return {
                    "success": False,
                    "error": "LLM API key not configured",
                    "provider": "mock",
                    "mock_response": True,
                    "data": self._get_mock_analysis()
                }
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert legal analyst. Analyze the provided legal document and extract key information."
                    },
                    {
                        "role": "user",
                        "content": f"""Analyze this legal document and provide:
1. Key parties involved
2. Main contract obligations
3. Payment terms
4. Risk factors
5. Compliance requirements

Document text:
{text[:2000]}..."""  # Limit to first 2000 chars for demo
                    }
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            return {
                "success": True,
                "provider": "openai",
                "analysis": response.choices[0].message.content
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "provider": f"{self.provider}-fallback",
                "mock_response": True,
                "data": self._get_mock_analysis()
            }
    
    async def extract_entities(self, text: str) -> dict:
        """Extract legal entities from document"""
        try:
            if self.provider == "gemini":
                content = await self._generate_with_gemini(
                    "Extract legal entities, names, dates, amounts, obligations, and contacts from the document.",
                    f"Extract entities from this legal document. Return concise structured text:\n{text[:5000]}"
                )
                return {
                    "success": True,
                    "provider": "gemini",
                    "entities": self._entities_from_text(content)
                }

            if not self.client:
                data = self._get_mock_entities()
                data["provider"] = "mock"
                return data
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Extract all legal entities, names, dates, and amounts from the document."
                    },
                    {
                        "role": "user",
                        "content": f"Extract entities from: {text[:1500]}"
                    }
                ],
                temperature=0.3,
                max_tokens=800
            )
            
            return {
                "success": True,
                "provider": "openai",
                "entities": response.choices[0].message.content
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "provider": f"{self.provider}-fallback",
                "data": self._get_mock_entities()
            }
    
    async def generate_report(self, analysis: str, entities: str) -> dict:
        """Generate comprehensive report"""
        try:
            if self.provider == "gemini":
                content = await self._generate_with_gemini(
                    "Generate a professional legal intelligence report with summary, findings, risk, and recommendations.",
                    f"""Based on this analysis and entities, generate a concise legal intelligence report:

Analysis: {analysis[:2500]}
Entities: {entities[:1500]}"""
                )
                report = self._get_mock_report()
                report["summary"] = content[:900]
                report["generated_with"] = "gemini"
                return {
                    "success": True,
                    "provider": "gemini",
                    "data": report
                }

            if not self.client:
                report = self._get_mock_report()
                report["provider"] = "mock"
                return report
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Generate a professional legal analysis report."
                    },
                    {
                        "role": "user",
                        "content": f"""Based on this analysis and entities, generate a report:
                        
Analysis: {analysis[:1000]}
Entities: {entities[:500]}"""
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            return {
                "success": True,
                "provider": "openai",
                "report": response.choices[0].message.content
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "provider": f"{self.provider}-fallback",
                "data": self._get_mock_report()
            }

    async def answer_question(self, question: str, document_text: str, analysis_context: str) -> dict:
        """Answer a user question using the uploaded document and agent results."""
        try:
            if self.provider == "gemini":
                answer = await self._generate_with_gemini(
                    "You answer questions about legal documents in simple, careful language. Do not invent facts. If the answer is not in the document or analysis, say what is missing.",
                    f"""Document text:
{document_text[:5000]}

Agent analysis:
{analysis_context[:4000]}

User question:
{question}

Answer in plain language with 2-5 concise bullet points when useful."""
                )
                return {
                    "success": True,
                    "provider": "gemini",
                    "answer": answer,
                }

            if self.client:
                response = self.client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {
                            "role": "system",
                            "content": "You answer questions about legal documents in simple, careful language. Do not invent facts."
                        },
                        {
                            "role": "user",
                            "content": f"""Document text:
{document_text[:5000]}

Agent analysis:
{analysis_context[:4000]}

Question:
{question}"""
                        }
                    ],
                    temperature=0.2,
                    max_tokens=900
                )
                return {
                    "success": True,
                    "provider": "openai",
                    "answer": response.choices[0].message.content,
                }

            return {
                "success": True,
                "provider": "mock",
                "answer": self._mock_question_answer(question, analysis_context),
            }
        except Exception as e:
            return {
                "success": True,
                "provider": f"{self.provider}-fallback",
                "answer": self._mock_question_answer(question, analysis_context),
                "error": str(e),
            }

    @staticmethod
    async def _generate_with_gemini(system_prompt: str, user_prompt: str) -> str:
        """Generate content with the Gemini Developer API."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent"
        )
        payload = {
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 1500
            }
        }

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                url,
                params={"key": settings.GEMINI_API_KEY},
                json=payload
            )
            response.raise_for_status()
            data = response.json()

        candidates = data.get("candidates", [])
        if not candidates:
            return ""
        parts = candidates[0].get("content", {}).get("parts", [])
        return "\n".join(part.get("text", "") for part in parts).strip()

    @staticmethod
    def _entities_from_text(content: str) -> dict:
        """Convert model text into the entity shape used by the dashboard."""
        lines = [line.strip("-*• \t") for line in content.splitlines() if line.strip()]
        dates = []
        amounts = []
        parties = []

        for line in lines:
            lower = line.lower()
            if any(marker in lower for marker in ("date", "effective", "deadline", "expiry", "expiration")):
                dates.append({"date": line[:40], "event": line})
            elif any(symbol in line for symbol in ("$", "₹", "€", "£")) or "amount" in lower:
                amounts.append({"value": line[:40], "description": line})
            elif any(marker in lower for marker in ("party", "buyer", "seller", "plaintiff", "defendant", "company")):
                parties.append({"name": line[:80], "role": "Extracted entity"})

        return {
            "parties": parties[:8] or [{"name": "Extracted parties available in raw response", "role": "See raw"}],
            "amounts": amounts[:8],
            "dates": dates[:8],
            "contacts": len(parties) + len(amounts) + len(dates),
            "raw": content[:2000]
        }

    @staticmethod
    def _mock_question_answer(question: str, analysis_context: str) -> str:
        lower_question = question.lower()
        if "risk" in lower_question:
            return "The main risks identified are payment delay, breach liability, and unclear obligations. Review the risk section before signing or acting on the document."
        if "party" in lower_question or "who" in lower_question:
            return "The document appears to involve the parties extracted in the entity section. Check the Parties card in the report for exact names and roles."
        if "date" in lower_question or "timeline" in lower_question:
            return "The important dates are listed in the timeline section. The system extracted dates from the document and converted them into review events."
        return "I can answer based on the uploaded document and the generated analysis. Please ask about parties, dates, obligations, risks, contradictions, or recommendations."
    
    @staticmethod
    def _get_mock_analysis() -> dict:
        """Return mock analysis for testing"""
        return {
            "parties": ["Party A Inc.", "Party B LLC", "Third Party Co."],
            "obligations": [
                "Payment of $50,000 within 30 days",
                "Delivery of goods by Q4 2024",
                "Warranty for 12 months"
            ],
            "payment_terms": "Net 30 days, 2% early payment discount",
            "risks": [
                "Late payment penalties",
                "Liability for breach",
                "Intellectual property disputes"
            ],
            "compliance": ["GDPR", "CCPA", "Industry standards"]
        }
    
    @staticmethod
    def _get_mock_entities() -> dict:
        """Return mock entities for testing"""
        return {
            "parties": [
                {"name": "Acme Corporation", "role": "Buyer"},
                {"name": "Global Suppliers Ltd", "role": "Seller"}
            ],
            "amounts": [
                {"value": "$50,000", "description": "Contract value"},
                {"value": "$5,000", "description": "Deposit"}
            ],
            "dates": [
                {"date": "2024-01-15", "event": "Effective date"},
                {"date": "2024-12-31", "event": "Expiration date"}
            ],
            "contacts": 24
        }
    
    @staticmethod
    def _get_mock_report() -> dict:
        """Return mock report for testing"""
        return {
            "title": "Legal Analysis Report",
            "summary": "This contract between Acme Corporation and Global Suppliers Ltd outlines supply and delivery terms.",
            "key_findings": [
                "Payment terms are standard Net 30",
                "All required compliance provisions included",
                "Clear liability limitations",
                "Dispute resolution through arbitration"
            ],
            "risk_assessment": {
                "overall_risk": "Low",
                "critical_issues": 0,
                "warnings": 2,
                "notes": 5
            },
            "recommendations": [
                "Add force majeure clause",
                "Consider insurance requirements",
                "Review jurisdiction clauses"
            ]
        }
