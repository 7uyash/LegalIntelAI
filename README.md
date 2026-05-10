# NyayaViveka AI Investigator

> An AI-powered autonomous legal intelligence platform designed to analyze legal documents, investigate public evidence, retrieve legal precedents, detect contradictions, and generate structured legal investigation reports using a multi-agent architecture.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## 🎯 Core Vision

Traditional legal investigation is:
- ❌ Slow and fragmented
- ❌ Document-heavy with manual processes
- ❌ Difficult to automate at scale
- ❌ Limited to chatbot-style interactions

**NyayaViveka AI Investigator** transforms legal intelligence by building a system of autonomous agents capable of:

✅ Analyzing legal documents intelligently  
✅ Researching legal precedents and case law  
✅ Gathering external evidence via live web investigation  
✅ Detecting inconsistencies and contradictions  
✅ Reconstructing chronological timelines  
✅ Estimating legal risk and compliance impact  
✅ Generating actionable intelligence reports  

---

## 🏗️ System Architecture

```
User Uploads Legal Document (FIR, Agreement, Notice)
		    ↓
	    PDF Parsing & Extraction
		    ↓
	 Orchestrator Agent Activated
		    ↓
    ┌─────────────────────────────────┐
    │  Multi-Agent Parallel Analysis   │
    ├─────────────────────────────────┤
    │ • Legal Research Agent           │
    │ • Evidence Collection Agent      │
    │ • Contradiction Detection Agent  │
    │ • Timeline Reconstruction Agent  │
    │ • Risk Assessment Agent          │
    │ • Report Generation Agent        │
    └─────────────────────────────────┘
		    ↓
	 Aggregated Findings
		    ↓
    Final Legal Intelligence Report
		    ↓
    Interactive Frontend Dashboard
```

---

## 🚀 Key Features

### Intelligent Document Analysis
- Automatic PDF extraction and parsing
- Entity recognition (parties, dates, amounts)
- Legal issue identification
- Evidence extraction and summarization

### Multi-Agent Investigation
- **Orchestrator Agent**: Coordinates workflow and task distribution
- **Legal Research Agent**: Retrieves laws, precedents, and case references
- **Evidence Collection Agent**: Live web investigation via Apify
- **Contradiction Detection Agent**: Identifies inconsistencies and anomalies
- **Timeline Reconstruction Agent**: Builds chronological event sequences
- **Risk Assessment Agent**: Evaluates legal severity and compliance risks

### Live Web Investigation
- Real-time evidence gathering via Apify actors
- Public record verification
- News and article analysis
- Entity research and background checks

### Advanced Report Generation
- Structured legal intelligence reports
- Case summary and legal issues
- Evidence findings with sources
- Contradiction analysis
- Timeline reconstruction
- Risk assessment and severity scoring
- Actionable recommendations

### Interactive Dashboard
- Real-time agent workflow visualization
- Animated investigation progress
- Evidence timeline display
- Risk metrics and findings
- Exportable intelligence reports

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom dark theme
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn ASGI
- **PDF Processing**: PyPDF2
- **AI/LLM**: OpenAI GPT-4
- **Web Framework**: Starlette

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Superplane-ready architecture
- **Hosting**: Vercel (Frontend), Railway/Render (Backend)

### Integrations
- **Apify**: Autonomous web investigation
- **Zynd AI**: Multi-agent orchestration
- **OpenAI API**: LLM reasoning
- **GitHub Copilot**: Development acceleration

---

## 📁 Project Structure

```
LegalIntelAI/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── Header.tsx
│   │   ├── UploadSection.tsx
│   │   ├── WorkflowSection.tsx
│   │   ├── AgentWorkflow.tsx   # Agent visualization
│   │   ├── ReportDashboard.tsx
│   │   ├── TimelineSection.tsx
│   │   └── Footer.tsx
│   ├── services/               # API clients
│   ├── styles/                 # Global styles
│   └── package.json
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI app initialization
│   │   ├── config.py          # Configuration settings
│   │   ├── models.py          # Pydantic models
│   │   ├── routes.py          # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── file_service.py        # PDF handling
│   │   │   ├── ai_service.py         # OpenAI integration
│   │   │   ├── apify_service.py      # Apify integration
│   │   │   ├── agent_orchestrator.py # Agent coordination
│   │   │   ├── contradiction_detector.py
│   │   │   ├── timeline_service.py
│   │   │   └── report_service.py
│   │   └── utils/
│   ├── main.py                # Entry point
│   ├── requirements.txt
│   ├── venv/                  # Virtual environment
│   ├── uploads/               # PDF storage
│   └── Dockerfile
│
├── docs/                        # Documentation
│   ├── SETUP.md               # Installation guide
│   ├── ARCHITECTURE.md        # System architecture
│   ├── API.md                 # API documentation
│   ├── AGENTS.md              # Agent specifications
│   ├── INTEGRATIONS.md        # Integration guides
│   ├── DEPLOYMENT.md          # Deployment instructions
│   └── DEVELOPMENT.md         # Development guide
│
├── docker-compose.yml          # Docker orchestration
├── Dockerfile                  # Container configuration
├── .env.example               # Environment template
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm
- Docker (optional)
- OpenAI API key (optional, mock responses work without it)

### 1. Clone Repository
```bash
git clone <repository-url>
cd LegalIntelAI
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your OpenAI API key (optional)

# Start backend server
python main.py
```

Backend runs on: `http://localhost:8001`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# Already configured for backend on port 8001

# Start frontend development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 4. Test the System
```bash
# Test backend health
curl http://localhost:8001/health

# Visit frontend
open http://localhost:3000
```

---

## 🔧 API Endpoints

### Health & Status
- `GET /` - API information and status
- `GET /health` - Health check endpoint

### Document Management
- `POST /api/upload` - Upload PDF document
- `GET /api/documents/{file_id}` - Get document status

### Analysis & Investigation
- `POST /api/analyze/{file_id}` - Trigger multi-agent analysis
- `POST /api/investigate/{file_id}` - Start live web investigation

### Reports
- `POST /api/reports/{file_id}` - Generate intelligence report
- `GET /api/reports/{report_id}` - Retrieve generated report

See [API.md](docs/API.md) for detailed endpoint documentation.

---

## 🤖 Autonomous Agents

### 1. Orchestrator Agent
**Role**: Coordinates all workflows and task distribution
- Parses document and identifies legal issues
- Distributes tasks to specialized agents
- Aggregates findings and manages workflow state

### 2. Legal Research Agent
**Role**: Retrieves legal precedents and case law
- Searches legal databases
- Identifies relevant statutes and case references
- Provides legal context and precedent analysis

### 3. Evidence Collection Agent
**Role**: Autonomous web investigation via Apify
- Searches public web sources
- Gathers contextual evidence
- Investigates entities and public records
- Collects relevant news and articles

### 4. Contradiction Detection Agent
**Role**: Identifies inconsistencies and anomalies
- Compares statements across documents
- Finds missing information
- Detects timeline conflicts
- Flags suspicious claims

### 5. Timeline Reconstruction Agent
**Role**: Builds chronological event sequences
- Extracts dates and events
- Reconstructs case timeline
- Identifies causality relationships
- Validates temporal consistency

### 6. Risk Assessment Agent
**Role**: Evaluates legal severity and compliance risks
- Calculates fraud likelihood score
- Assesses legal complexity
- Identifies compliance risks
- Determines case severity

See [AGENTS.md](docs/AGENTS.md) for detailed agent specifications.

---

## 🔗 Integrations

### Apify Integration
Enables autonomous web investigation for evidence gathering.

**Use Cases**:
- Company fraud investigation
- Public record verification
- News and article analysis
- Entity background checks

**Implemented Actors**:
- Google Search Scraper
- Website Content Crawler
- News scraping actors

See [INTEGRATIONS.md](docs/INTEGRATIONS.md#apify) for setup.

### Zynd AI Integration
Orchestrates multi-agent workflows and LLM reasoning.

**Agents Powered by Zynd**:
- All 6 autonomous agents
- Parallel task execution
- Cross-agent communication
- Result aggregation

See [INTEGRATIONS.md](docs/INTEGRATIONS.md#zynd-ai) for setup.

### OpenAI Integration
GPT-4 powers all legal reasoning and analysis tasks.

**Features**:
- Document analysis
- Entity extraction
- Legal issue identification
- Report generation
- Risk assessment

See [INTEGRATIONS.md](docs/INTEGRATIONS.md#openai) for setup.

### Superplane Integration
Production-ready deployment infrastructure.

**Capabilities**:
- Scalable agent execution
- Production deployment workflows
- Monitoring and logging
- Auto-scaling infrastructure

See [DEPLOYMENT.md](docs/DEPLOYMENT.md#superplane) for setup.

---

## 🔐 Environment Configuration

Create `.env` file in backend directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4

# Apify Configuration (optional)
APIFY_API_KEY=your-apify-key-here
APIFY_ENABLED=true

# Zynd AI Configuration (optional)
ZYND_API_KEY=your-zynd-key-here

# Server Configuration
DEBUG=true
HOST=0.0.0.0
PORT=8001

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000","http://127.0.0.1:3000"]

# File Handling
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800  # 50MB in bytes
```

Create `.env.local` file in frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down
```

**Services**:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8001`
- API Docs: `http://localhost:8001/docs`

---

## 📚 Documentation

- [SETUP.md](docs/SETUP.md) - Detailed installation and configuration
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design and components
- [API.md](docs/API.md) - Complete API reference
- [AGENTS.md](docs/AGENTS.md) - Agent specifications and workflows
- [INTEGRATIONS.md](docs/INTEGRATIONS.md) - Integration setup guides
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guide

---

## 💡 Demo Workflow

1. **Upload Document**: User uploads FIR, agreement, or legal notice
2. **Agent Activation**: Orchestrator activates 6 specialized agents
3. **Live Investigation**: Evidence Collection Agent gathers web data
4. **Analysis**: Each agent performs parallel analysis
5. **Contradiction Detection**: Identifies inconsistencies
6. **Timeline Reconstruction**: Builds chronological sequence
7. **Risk Assessment**: Calculates severity and compliance risk
8. **Report Generation**: Generates structured intelligence report
9. **Dashboard Display**: Interactive results visualization

---

## 🌟 Key Innovations

✨ **Multi-Agent Architecture**: Instead of single chatbot, orchestrated society of specialized legal agents

✨ **Autonomous Web Investigation**: Live evidence gathering integrated into legal analysis

✨ **Contradiction Detection**: Automated identification of inconsistencies and anomalies

✨ **Timeline Reconstruction**: Intelligent chronological event sequencing

✨ **Risk Assessment**: Quantified legal severity and compliance scoring

✨ **Scalable Infrastructure**: Superplane-ready for production deployment

---

## 🚀 Future Enhancements

- [ ] Multilingual legal document support
- [ ] Courtroom preparation workflows
- [ ] Voice and audio document input
- [ ] Blockchain evidence verification
- [ ] Persistent vector memory for case history
- [ ] Advanced legal analytics and trends
- [ ] Automated compliance monitoring
- [ ] Real-time legal notifications
- [ ] Case law citation generation
- [ ] Predictive legal outcome modeling

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/agent-name`
2. Make your changes with clear commit messages
3. Push to branch: `git push origin feature/agent-name`
4. Submit pull request with description

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For questions, issues, or feedback:
- Create an issue on GitHub
- Check documentation in `docs/` directory
- Review API documentation at `/docs` endpoint

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 language models
- **Apify** for web scraping and investigation tools
- **Zynd AI** for multi-agent orchestration
- **GitHub Copilot** for development acceleration
- **Superplane** for production infrastructure

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
