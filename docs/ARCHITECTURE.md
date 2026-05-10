# Architecture - NyayaViveka AI Investigator

Complete system architecture, design patterns, and component interactions.

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Multi-Agent System](#multi-agent-system)
5. [Data Flow](#data-flow)
6. [Integration Points](#integration-points)
7. [Security Architecture](#security-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
│                   (http://localhost:3000)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                             │
│  • React Components                                              │
│  • Framer Motion Animations                                      │
│  • Axios HTTP Client                                             │
│  • Tailwind Styling                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                              │
│  (http://localhost:8001)                                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              API Routes Layer                               │ │
│  │  /api/upload  /api/analyze  /api/reports  /api/investigate │ │
│  └────────────────┬───────────────────────────────────────────┘ │
│                   │                                               │
│  ┌────────────────▼───────────────────────────────────────────┐ │
│  │           Multi-Agent Orchestrator                          │ │
│  │  • Orchestrator Agent                                       │ │
│  │  • Legal Research Agent                                     │ │
│  │  • Evidence Collection Agent                                │ │
│  │  • Contradiction Detection Agent                            │ │
│  │  • Timeline Reconstruction Agent                            │ │
│  │  • Risk Assessment Agent                                    │ │
│  └────────────────┬───────────────────────────────────────────┘ │
│                   │                                               │
│  ┌────────────────▼───────────────────────────────────────────┐ │
│  │              Service Layer                                  │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │ │
│  │  │  FileService│  │ AIService    │  │ ApifyService       │ │ │
│  │  │             │  │              │  │                    │ │ │
│  │  │ • Upload    │  │ • Analyze    │  │ • Web Investigation│ │ │
│  │  │ • Extract   │  │ • Extract    │  │ • Evidence Gather  │ │ │
│  │  │ • Storage   │  │ • Generate   │  │ • Entity Search    │ │ │
│  │  └─────────────┘  └──────────────┘  └────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌────────────────┐  ┌─────────────┐  ┌────────────────────┐ │ │
│  │  │TimelineService │  │ReportService│  │ContradictionDetect │ │ │
│  │  │                │  │             │  │                    │ │ │
│  │  │ • Timeline     │  │ • Generate  │  │ • Find conflicts   │ │ │
│  │  │   Extraction   │  │ • Format    │  │ • Detect gaps      │ │ │
│  │  │ • Date Parsing │  │ • Structure │  │ • Flag anomalies   │ │ │
│  │  └────────────────┘  └─────────────┘  └────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                   │                                               │
│  ┌────────────────▼───────────────────────────────────────────┐ │
│  │              Data Storage Layer                             │ │
│  │  • documents_db (in-memory)                                 │ │
│  │  • analyses_db (in-memory)                                  │ │
│  │  • reports_db (in-memory)                                   │ │
│  │  • uploads/ (file system)                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────┬───────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────────┐
    │            │            │                  │
    ▼            ▼            ▼                  ▼
┌────────┐  ┌────────┐  ┌──────────┐  ┌────────────────┐
│ OpenAI │  │ Apify  │  │ Zynd AI  │  │ External APIs  │
│        │  │        │  │          │  │                │
│ GPT-4  │  │ Search │  │Orchestr. │  │ • News APIs    │
│        │  │ Scrape │  │ Workflow │  │ • Public Data  │
└────────┘  └────────┘  └──────────┘  └────────────────┘
```

### Key Design Principles

1. **Separation of Concerns**: Each agent/service has specific responsibility
2. **Parallel Processing**: Agents work independently for performance
3. **Scalability**: Service layer allows horizontal scaling
4. **Extensibility**: New agents can be added without modifying existing code
5. **Resilience**: Graceful degradation with mock responses

---

## Frontend Architecture

### Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Logo
│   ├── Navigation Links
│   └── Section Selector
├── Main Content
│   ├── UploadSection (when activeSection === 'upload')
│   │   ├── DragDrop Area
│   │   ├── File Input
│   │   ├── Progress Bar
│   │   └── Status Message
│   ├── WorkflowSection (when activeSection === 'workflow')
│   │   ├── WorkflowSteps Container
│   │   ├── AgentWorkflow
│   │   │   ├── Step 1: Document Parsing
│   │   │   ├── Step 2: Agent Activation
│   │   │   ├── Step 3: Web Investigation
│   │   │   ├── Step 4: Evidence Analysis
│   │   │   ├── Step 5: Contradiction Detection
│   │   │   └── Step 6: Report Generation
│   │   └── Progress Stats
│   ├── ReportDashboard (when activeSection === 'dashboard')
│   │   ├── Metrics Cards
│   │   │   ├── Documents Analyzed
│   │   │   ├── Entities Found
│   │   │   ├── Risks Identified
│   │   │   └── Overall Score
│   │   ├── Findings Grid
│   │   │   ├── Finding Cards (High, Medium, Low)
│   │   │   └── Severity Indicators
│   │   └── Export Button
│   └── TimelineSection (when activeSection === 'timeline')
│       ├── Timeline Container
│       ├── Event Markers
│       ├── Event Details
│       └── Timeline Stats
└── Footer
    ├── Links
    ├── Copyright
    └── Support Info
```

### Frontend Technology Stack

```
Next.js 14
├── React 18
│   ├── Hooks (useState, useEffect)
│   └── Functional Components
├── TypeScript
│   ├── Type Definitions
│   └── Interface Definitions
├── Tailwind CSS
│   ├── Utility Classes
│   ├── Dark Theme
│   └── Responsive Design
├── Framer Motion
│   ├── Animations
│   ├── Transitions
│   └── Gesture Handling
└── Axios
    └── HTTP Client
```

### State Management

```
App Level State:
├── activeSection: 'upload' | 'workflow' | 'dashboard' | 'timeline'
├── uploadSuccess: boolean
├── currentFileId: string | null
├── analysisStatus: 'pending' | 'in-progress' | 'completed' | 'error'
└── workflowSteps: Array<{
    id: string
    title: string
    description: string
    status: 'completed' | 'in-progress' | 'pending'
  }>
```

### API Integration (Axios)

```
axios instance
├── Base URL: process.env.NEXT_PUBLIC_API_URL (http://localhost:8001)
├── Headers
│   ├── Content-Type: application/json
│   └── CORS: enabled
└── Endpoints
    ├── POST /api/upload
    ├── GET /api/documents/{fileId}
    ├── POST /api/analyze/{fileId}
    ├── GET /api/reports/{reportId}
    └── POST /api/investigate/{fileId}
```

---

## Backend Architecture

### FastAPI Application Structure

```
app/
├── main.py
│   ├── FastAPI() initialization
│   ├── CORS Middleware
│   ├── Error Handlers
│   └── Route Inclusion
│
├── config.py
│   ├── Settings class
│   ├── Environment Variables
│   └── Constants
│
├── models.py
│   ├── Pydantic Models (Request/Response)
│   ├── ValidationPydantic constraints
│   └── Type Definitions
│
├── routes.py
│   ├── @app.get("/") - Root
│   ├── @app.get("/health") - Health check
│   ├── @app.post("/api/upload") - PDF upload
│   ├── @app.post("/api/analyze/{file_id}") - Analysis
│   ├── @app.post("/api/reports/{file_id}") - Report generation
│   ├── @app.get("/api/documents/{file_id}") - Document status
│   ├── @app.get("/api/reports/{report_id}") - Retrieve report
│   └── @app.post("/api/investigate/{file_id}") - Web investigation
│
└── services/
    ├── file_service.py
    │   ├── save_upload_file(file)
    │   ├── extract_text_from_pdf(file_path)
    │   └── get_file_info(file_path)
    │
    ├── ai_service.py
    │   ├── analyze_legal_document(text)
    │   ├── extract_entities(text)
    │   ├── generate_report(analysis, entities)
    │   └── _get_mock_responses()
    │
    ├── apify_service.py
    │   ├── search_web_evidence(query)
    │   ├── investigate_entity(entity_name)
    │   ├── gather_news_articles(topic)
    │   └── collect_public_records(search_term)
    │
    ├── agent_orchestrator.py
    │   ├── activate_agents(document_data)
    │   ├── distribute_tasks(legal_issues)
    │   ├── aggregate_findings(agent_results)
    │   └── manage_workflow_state()
    │
    ├── contradiction_detector.py
    │   ├── find_inconsistencies(statements)
    │   ├── detect_timeline_conflicts(events)
    │   ├── identify_missing_info(analysis)
    │   └── flag_suspicious_claims(entities)
    │
    ├── timeline_service.py
    │   ├── extract_dates_events(text)
    │   ├── reconstruct_timeline(events)
    │   ├── validate_chronology(timeline)
    │   └── identify_causality(events)
    │
    └── report_service.py
        ├── generate_report(findings)
        ├── format_report(data)
        ├── calculate_risk_score(analysis)
        └── export_report(format)
```

### Database Schema (In-Memory)

```python
# documents_db: Dict[str, Document]
{
  "file_123": {
    "id": "file_123",
    "filename": "FIR_2024.pdf",
    "upload_time": "2024-05-10T10:00:00",
    "file_path": "uploads/file_123.pdf",
    "status": "analyzed",
    "raw_text": "...",
    "pages": 5
  }
}

# analyses_db: Dict[str, Analysis]
{
  "analysis_123": {
    "id": "analysis_123",
    "file_id": "file_123",
    "legal_issues": [...],
    "entities": [...],
    "contradictions": [...],
    "timeline": [...],
    "risk_score": 8.5,
    "status": "completed"
  }
}

# reports_db: Dict[str, Report]
{
  "report_123": {
    "id": "report_123",
    "file_id": "file_123",
    "analysis_id": "analysis_123",
    "summary": "...",
    "findings": [...],
    "recommendations": [...],
    "generated_at": "2024-05-10T10:15:00",
    "format": "pdf"
  }
}
```

---

## Multi-Agent System

### Agent Architecture

Each agent operates independently but coordinates through the Orchestrator Agent.

```
┌────────────────────────────────────────────────────────┐
│              Orchestrator Agent                         │
│                                                          │
│  Responsibilities:                                      │
│  • Parse document and identify legal issues             │
│  • Create task queue for other agents                   │
│  • Manage parallel agent execution                      │
│  • Aggregate findings and manage state                  │
└──────┬─────────┬────────┬───────────┬──────────┬────────┘
       │         │        │           │          │
       ▼         ▼        ▼           ▼          ▼
   ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐
   │ Legal  │ │Evidence
   │Research│ │Collection
   │ Agent  │ │ Agent
   │        │ │
   │ • Find │ │ • Search
   │precedents
   │ • Case │ │ • Gather
   │law     │ │ • Apify
   │ • Context
   │        │ │ • Public
   │        │ │   records
   └────────┘ └──────┘
   
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │Contradiction
   │ Detection  │ │ Timeline   │ │   Risk     │
   │ Agent      │ │Reconstruction
   │            │ │Assessment  │
   │            │ │ Agent       │ │   Agent    │
   │ • Compare  │ │            │ │            │
   │statements  │ │ • Extract  │ │ • Calc     │
   │ • Gaps     │ │   dates    │ │   score    │
   │ • Conflicts│ │ • Build    │ │ • Severity │
   │            │ │   sequence │ │ • Risk     │
   └────────────┘ └────────────┘ └────────────┘
```

### Agent Workflow

```
1. Document Upload
   └─> Extract text with FileService

2. Orchestrator Agent Activated
   ├─> Parse document
   ├─> Identify legal issues
   └─> Create task queue

3. Parallel Agent Execution
   ├─> Legal Research Agent
   │   └─> Search legal database
   ├─> Evidence Collection Agent
   │   └─> Query Apify actors
   ├─> Contradiction Detection Agent
   │   └─> Analyze statements
   ├─> Timeline Reconstruction Agent
   │   └─> Extract and organize events
   └─> Risk Assessment Agent
       └─> Calculate severity scores

4. Aggregation
   └─> Combine all findings

5. Report Generation
   └─> Format and export results
```

---

## Data Flow

### PDF Upload & Processing

```
User Upload (Browser)
        │
        ▼
POST /api/upload (FormData)
        │
        ▼
FileService.save_upload_file()
        ├─> Validate file (size, type)
        ├─> Save to uploads/ directory
        └─> Return file_id
        │
        ▼
FileService.extract_text_from_pdf()
        ├─> Read PDF file
        ├─> Extract text pages
        └─> Return raw_text
        │
        ▼
Store in documents_db
        │
        ▼
Return to Frontend
        │
        ▼
Update UI with file_id
```

### Analysis & Investigation

```
POST /api/analyze/{file_id}
        │
        ▼
Orchestrator Agent.activate_agents()
        │
    ┌───┴────┬────────┬──────────┬──────────┐
    │        │        │          │          │
    ▼        ▼        ▼          ▼          ▼
  Legal   Evidence  Contradiction
 Research Collection Detection
  Agent    Agent     Agent
    │        │        │
    └────┬───┴───┬────┘
         │       │
         ▼       ▼
    Timeline  Risk Assessment
    Reconstruct
    Agent      Agent
         │       │
         └───┬───┘
             │
             ▼
    Aggregate all findings
             │
             ▼
    Store in analyses_db
             │
             ▼
    Return analysis_id
```

### Report Generation

```
POST /api/reports/{file_id}
        │
        ▼
Retrieve analysis from analyses_db
        │
        ▼
ReportService.generate_report()
        ├─> Format findings
        ├─> Calculate risk scores
        ├─> Create summary
        └─> Add recommendations
        │
        ▼
Store in reports_db
        │
        ▼
Return report_id and content
```

---

## Integration Points

### External Service Integration

```
Backend
├── OpenAI API
│   ├── GPT-4 for analysis
│   ├── Embeddings for similarity
│   └── Rate limits: 3,500 RPM
│
├── Apify
│   ├── Google Search actor
│   ├── Website scraper
│   ├── News crawler
│   └── Entity investigation
│
├── Zynd AI
│   ├── Agent orchestration
│   ├── Workflow management
│   ├── Multi-agent coordination
│   └── LLM routing
│
└── External APIs
    ├── Public records
    ├── News sources
    ├── Legal databases
    └── Reference data
```

### Error Handling

```
All Services
├── Try-Except blocks
├── Graceful degradation
├── Mock responses fallback
└── Error logging

Frontend
├── Error boundary components
├── User-friendly messages
└── Retry mechanisms
```

---

## Security Architecture

### Authentication & Authorization

```
Current Implementation (Development):
├── CORS enabled for localhost:3000
├── No authentication required
└── Open API endpoints

Production Considerations:
├── JWT token-based auth
├── API key validation
├── Rate limiting
├── Request signing
└── HTTPS enforcement
```

### Data Security

```
Upload Security
├── File type validation (PDF only)
├── File size limits (50MB max)
├── Virus scanning
└── Secure storage

API Security
├── Input validation (Pydantic)
├── SQL injection prevention
├── XSS protection
└── CSRF tokens

Credential Security
├── Environment variables
├── Never commit secrets
├── Encrypted storage
└── Secret rotation
```

---

## Deployment Architecture

### Docker Containerization

```
Container Setup:
├── Frontend Container
│   ├── Base: node:18-alpine
│   ├── Build: npm run build
│   ├── Serve: npm start
│   └── Port: 3000
│
├── Backend Container
│   ├── Base: python:3.12-slim
│   ├── Install: pip install -r requirements.txt
│   ├── Run: python main.py
│   └── Port: 8001
│
└── Docker Compose
    ├── Orchestrates both containers
    ├── Network: shared
    ├── Environment: config
    └── Volumes: persistence
```

---

## Performance Considerations

### Frontend Optimization
- Code splitting with Next.js
- Image optimization
- CSS-in-JS minimization
- Lazy loading components

### Backend Optimization
- Async/await for I/O operations
- Connection pooling
- Caching strategies
- Query optimization

### Scalability
- Stateless services
- Horizontal scaling ready
- Load balancer compatible
- Database migration path (SQL)

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
