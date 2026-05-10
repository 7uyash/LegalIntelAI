from app.config import settings
from openai import OpenAI, APIError


class AIService:
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception:
                self.client = None
    
    async def analyze_legal_document(self, text: str) -> dict:
        """Analyze legal document using OpenAI"""
        try:
            if not self.client:
                return {
                    "success": False,
                    "error": "OpenAI API key not configured",
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
                "analysis": response.choices[0].message.content
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "mock_response": True,
                "data": self._get_mock_analysis()
            }
    
    async def extract_entities(self, text: str) -> dict:
        """Extract legal entities from document"""
        try:
            if not self.client:
                return self._get_mock_entities()
            
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
                "entities": response.choices[0].message.content
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": self._get_mock_entities()
            }
    
    async def generate_report(self, analysis: str, entities: str) -> dict:
        """Generate comprehensive report"""
        try:
            if not self.client:
                return self._get_mock_report()
            
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
                "report": response.choices[0].message.content
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": self._get_mock_report()
            }
    
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
