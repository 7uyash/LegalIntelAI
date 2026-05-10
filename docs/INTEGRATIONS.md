# Integrations - NyayaViveka AI Investigator

Setup and configuration guides for all third-party integrations.

## Table of Contents

1. [OpenAI API Integration](#openai-api-integration)
2. [Apify Integration](#apify-integration)
3. [Zynd AI Integration](#zynd-ai-integration)
4. [GitHub Copilot Integration](#github-copilot-integration)
5. [Superplane Integration](#superplane-integration)

---

## OpenAI API Integration

### Purpose

GPT-4 powers all legal reasoning, document analysis, entity extraction, and report generation.

### Setup

#### Step 1: Get API Key

1. Visit https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Store securely (never commit to git)

#### Step 2: Configure Backend

Add to `backend/.env`:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_API_BASE=https://api.openai.com/v1  # Optional
OPENAI_REQUEST_TIMEOUT=60  # seconds
```

#### Step 3: Verify Installation

```bash
cd backend
python -c "from app.services.ai_service import AIService; print('OpenAI integration ready')"
```

### Usage in Code

```python
# backend/app/services/ai_service.py

from openai import OpenAI
from app.config import settings

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
    
    def analyze_legal_document(self, text: str):
        """Analyze document using GPT-4"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a legal expert analyzing documents..."
                },
                {
                    "role": "user",
                    "content": f"Analyze this legal document:\n\n{text}"
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        return response.choices[0].message.content
```

### API Limits

- **Rate Limit**: 3,500 requests per minute
- **Token Limit**: Varies by model
- **Timeout**: 60 seconds per request

### Cost Estimation

```
GPT-4 Input:  $0.03 per 1K tokens
GPT-4 Output: $0.06 per 1K tokens

Estimated cost per document:
- Average document: 2,000-5,000 tokens
- Analysis: 1,000-2,000 tokens
- Report: 1,000-3,000 tokens
- Total per document: ~4,000 tokens = $0.18-0.30 per analysis
```

### Testing Without API Key

Mock responses are automatically used if API key is not set:

```python
# System returns mock analysis without calling OpenAI
analysis = ai_service.analyze_legal_document(text)  # Uses mock if key missing
```

### Troubleshooting

**Error: `AuthenticationError: Incorrect API key provided`**

Solution:
```bash
# Verify key in .env
echo $OPENAI_API_KEY

# Test with curl
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Error: `RateLimitError: Rate limit exceeded`**

Solution:
- Wait before retrying
- Implement exponential backoff
- Check usage at platform.openai.com

---

## Apify Integration

### Purpose

Enables autonomous web investigation, evidence gathering, and public record verification.

### Setup

#### Step 1: Create Apify Account

1. Sign up at https://apify.com/
2. Verify email
3. Navigate to account settings

#### Step 2: Get API Key

1. Click "Settings" in left menu
2. Copy API token
3. Add to `.env`

#### Step 3: Configure Backend

Add to `backend/.env`:

```env
APIFY_API_KEY=your-apify-key-here
APIFY_ENABLED=true
APIFY_MAX_RETRIES=3
APIFY_TIMEOUT=300  # seconds
APIFY_MEMORY_LIMIT=16384  # MB
```

#### Step 4: Install Actor Clients

```bash
# Apify actors are accessed via API (no installation needed)
# Available actors:
# - google-search-scraper (ID: apify/google-search-scraper)
# - website-content-crawler (ID: apify/website-content-crawler)
# - news-scraper (ID: apify/google-news-scraper)
# - public-records-crawler (Custom actor)
```

### Usage in Code

```python
# backend/app/services/apify_service.py

from apify_client import ApifyClient
from app.config import settings

class ApifyService:
    def __init__(self):
        self.client = ApifyClient(token=settings.APIFY_API_KEY)
    
    async def search_company(self, company_name: str):
        """Search for company information via Google"""
        run = self.client.actor("apify/google-search-scraper").call(
            run_input={
                "queries": [company_name],
                "maxPagesPerQuery": 5,
                "customData": {"source": "investigator"}
            }
        )
        
        return run['output']['organicResults']
    
    async def search_news(self, entity: str):
        """Search news articles about entity"""
        run = self.client.actor("apify/google-news-scraper").call(
            run_input={
                "searchTerms": [entity],
                "maxResults": 20,
                "language": "en"
            }
        )
        
        return run['output']['newsArticles']
```

### Available Actors

| Actor | Purpose | Link |
|-------|---------|------|
| google-search-scraper | Web search results | https://apify.com/apify/google-search-scraper |
| website-content-crawler | Scrape websites | https://apify.com/apify/website-content-crawler |
| google-news-scraper | News articles | https://apify.com/apify/google-news-scraper |
| twitter-profile-scraper | Twitter profiles | https://apify.com/apify/twitter-profile-scraper |

### Cost Estimation

```
Platform credit pricing varies:
- Per actor run: $0.10-2.00
- Per crawled page: $0.01-0.05

Estimated monthly:
- 100 investigations × 5 actors × 0.50 = $250
- Heavy usage: $1,000-5,000/month
```

### Best Practices

1. **Error Handling**: Wrap actor calls in try-catch
2. **Timeouts**: Set reasonable timeouts (300s default)
3. **Caching**: Cache results to avoid duplicate runs
4. **Rate Limiting**: Implement backoff for rate limits

---

## Zynd AI Integration

### Purpose

Multi-agent orchestration, LLM routing, and complex workflow management.

### Setup

#### Step 1: Register for Zynd AI

1. Visit https://www.zynd.ai/
2. Create account
3. Verify email
4. Navigate to settings

#### Step 2: Get API Credentials

1. Copy API key
2. Copy Organization ID
3. Add to `.env`

#### Step 3: Configure Backend

Add to `backend/.env`:

```env
ZYND_API_KEY=your-zynd-key-here
ZYND_ORG_ID=your-org-id-here
ZYND_BASE_URL=https://api.zynd.ai/v1
ZYND_MODEL=gpt-4  # Default model for agent workflows
```

#### Step 4: Install SDK

```bash
pip install zynd-python
```

### Usage in Code

```python
# backend/app/services/agent_orchestrator.py

from zynd import ZyndClient
from app.config import settings

class OrchestratorAgent:
    def __init__(self):
        self.client = ZyndClient(
            api_key=settings.ZYND_API_KEY,
            org_id=settings.ZYND_ORG_ID
        )
    
    async def activate_agents(self, document_data: Dict):
        """Activate agents via Zynd orchestration"""
        
        agents = [
            self._legal_research_agent_config(),
            self._evidence_collection_agent_config(),
            self._contradiction_detection_agent_config(),
            self._timeline_reconstruction_agent_config(),
            self._risk_assessment_agent_config()
        ]
        
        # Execute agents in parallel using Zynd
        results = await self.client.execute_agents(
            agents=agents,
            input_data=document_data,
            parallel=True
        )
        
        return results
```

### Agent Configuration

```yaml
# agents/config.yaml

agents:
  legal_research:
    model: gpt-4
    temperature: 0.7
    max_tokens: 2000
    system_prompt: |
      You are a legal research expert...
  
  evidence_collection:
    model: gpt-4
    temperature: 0.5
    max_tokens: 3000
    tools:
      - web_search
      - apify
  
  contradiction_detection:
    model: gpt-4
    temperature: 0.9
    max_tokens: 1500
    
  timeline_reconstruction:
    model: gpt-4
    temperature: 0.7
    max_tokens: 2000
  
  risk_assessment:
    model: gpt-4
    temperature: 0.6
    max_tokens: 2000
```

### Workflow Composition

```python
workflow = {
    "name": "legal_investigation",
    "agents": ["legal_research", "evidence_collection", 
               "contradiction_detection", "timeline_reconstruction", 
               "risk_assessment"],
    "execution_mode": "parallel",
    "aggregation": "unified_report",
    "error_handling": "graceful_degradation"
}

results = await self.client.execute_workflow(workflow, document_data)
```

### Pricing

```
Zynd AI Usage Based Pricing:
- Per agent execution: $0.01-0.05
- Per 1K tokens: $0.001-0.01
- Workflows: $0.10-1.00 per execution
```

---

## GitHub Copilot Integration

### Purpose

Development acceleration for faster feature implementation and debugging.

### Setup

#### Step 1: Install GitHub Copilot

1. Install VS Code extension: "GitHub Copilot"
2. Install "GitHub Copilot Chat"
3. Log in with GitHub account
4. Authorize access

#### Step 2: Configure for Project

In `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "yaml": true,
    "javascript": true,
    "typescript": true,
    "python": true,
    "tsx": true,
    "jsx": true
  },
  "github.copilot.chat.search.topK": 5,
  "github.copilot.advanced": {
    "completionKeys": [
      "Tab"
    ],
    "inlineSuggestCount": 3
  }
}
```

### Usage Examples

#### Frontend Component Generation

```
Command: @workspace Generate a React component for timeline visualization 
with Framer Motion animations

Copilot generates: Complete TimelineSection.tsx component
```

#### Backend Service Implementation

```
Command: Create a FastAPI service for PDF text extraction using PyPDF2

Copilot generates: FileService class with complete implementation
```

#### Code Explanation

```
Select code: ai_service.py analyze_legal_document function
Command: /explain

Copilot explains: Function purpose, parameters, return values, and usage
```

#### Bug Fixing

```
Command: @workspace Fix the TypeError in agent_orchestrator.py

Copilot identifies and suggests fixes for agent coordination issues
```

### Best Practices

1. **Be Specific**: Describe exactly what you need
2. **Provide Context**: Use @workspace to reference files
3. **Review Code**: Always review Copilot-generated code
4. **Test Thoroughly**: Test suggested implementations
5. **Iterate**: Ask follow-up questions for improvements

---

## Superplane Integration

### Purpose

Production-ready deployment infrastructure and scalable agent execution.

### Setup

#### Step 1: Sign Up

1. Visit https://superplane.dev/
2. Create account
3. Link GitHub repository
4. Authorize access

#### Step 2: Configure Deployment

Create `superplane.yml`:

```yaml
deployment:
  platform: superplane
  services:
    backend:
      docker_image: legalintel-backend:latest
      port: 8001
      replicas: 2
      env_file: .env
      resources:
        cpu: "1"
        memory: "2Gi"
    
    frontend:
      docker_image: legalintel-frontend:latest
      port: 3000
      replicas: 1
      resources:
        cpu: "0.5"
        memory: "1Gi"

infrastructure:
  region: us-east-1
  autoscaling:
    enabled: true
    min_replicas: 1
    max_replicas: 5
    target_cpu: 70%

monitoring:
  enabled: true
  alerts:
    - metric: cpu_usage
      threshold: 85%
    - metric: memory_usage
      threshold: 90%
    - metric: error_rate
      threshold: 5%
```

#### Step 3: Deploy

```bash
# Deploy via Superplane CLI
superplane deploy

# Or via GitHub Actions (auto-deploy on push)
git push origin main
```

### Agent Infrastructure

```
Superplane Configuration for Agents:

agent_workers:
  legal_research:
    replicas: 1
    timeout: 300
    queue: legal_research_queue
  
  evidence_collection:
    replicas: 2  # More for web scraping
    timeout: 600
    queue: evidence_queue
  
  contradiction_detection:
    replicas: 1
    timeout: 300
    queue: contradiction_queue
  
  timeline_reconstruction:
    replicas: 1
    timeout: 300
    queue: timeline_queue
  
  risk_assessment:
    replicas: 1
    timeout: 300
    queue: risk_queue
```

### Monitoring Dashboard

- **Agent Health**: Monitor agent uptime and performance
- **Error Tracking**: Track failed agents and error rates
- **Metrics**: CPU, memory, request latency, throughput
- **Logs**: Centralized logging for all services
- **Alerts**: Email alerts for anomalies

### Pricing

```
Superplane Pricing:
- Starter: $50/month (2 services)
- Professional: $200/month (unlimited services)
- Enterprise: Custom pricing

Plus infrastructure costs (AWS, GCP, etc.)
```

---

## Integration Testing

### Test All Integrations

```bash
# Backend integration tests
cd backend
python -m pytest tests/integration/test_openai.py
python -m pytest tests/integration/test_apify.py
python -m pytest tests/integration/test_zynd.py
```

### Health Check Endpoint

```bash
# Check all integrations
curl http://localhost:8001/health/integrations

# Response:
{
  "openai": "connected",
  "apify": "connected",
  "zynd": "connected",
  "status": "all_integrated"
}
```

---

## Troubleshooting

### Common Integration Issues

| Issue | Solution |
|-------|----------|
| API key not found | Check `.env` file, verify key is correct |
| Rate limit exceeded | Implement exponential backoff, upgrade plan |
| Timeout errors | Increase timeout values in config |
| Connection refused | Check service is running, verify URLs |
| Authentication failed | Regenerate API key, check credentials |

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
