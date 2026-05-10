# LegalIntel AI - Architecture & Component Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Header Component (Navigation)                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ UploadSection    │ WorkflowSection                   │   │
│  │ - Drag & Drop    │ - Animated Steps                 │   │
│  │ - File Validation│ - Progress Tracking              │   │
│  │                  │ - Status Indicators              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ ReportDashboard  │ TimelineSection                   │   │
│  │ - Metrics        │ - Event Timeline                  │   │
│  │ - Findings       │ - Amendments                      │   │
│  │ - Risk Analysis  │ - Status History                  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Footer Component                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    HTTP / REST API
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes (/api)                                    │   │
│  │ ├── /upload         → FileService.save_upload_file   │   │
│  │ ├── /analyze/{id}   → AIService.analyze_document     │   │
│  │ ├── /reports/{id}   → AIService.generate_report      │   │
│  │ ├── /documents/{id} → Get document status            │   │
│  │ └── /health         → Health check                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Services                                             │   │
│  │ ├── FileService (file_service.py)                    │   │
│  │ │   ├── save_upload_file()                           │   │
│  │ │   ├── extract_text_from_pdf()                      │   │
│  │ │   └── get_file_info()                              │   │
│  │ └── AIService (ai_service.py)                        │   │
│  │     ├── analyze_legal_document()                     │   │
│  │     ├── extract_entities()                           │   │
│  │     └── generate_report()                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ External Services                                    │   │
│  │ ├── OpenAI API (GPT-4)                               │   │
│  │ └── PyPDF2 (PDF Processing)                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Frontend Components

### 1. Header Component (`Header.tsx`)
- **Purpose**: Navigation and branding
- **Features**:
  - Logo with gradient accent
  - Section navigation buttons
  - Responsive mobile menu
  - Sticky positioning

### 2. UploadSection (`UploadSection.tsx`)
- **Purpose**: Handle PDF document uploads
- **Features**:
  - Drag-and-drop interface
  - File validation
  - Progress indicators
  - File size display
  - Feature cards

### 3. WorkflowSection (`WorkflowSection.tsx`)
- **Purpose**: Visualize AI processing workflow
- **Features**:
  - 6-step animation pipeline
  - Progress tracking
  - Step indicators
  - Animated connections
  - Processing summary stats

### 4. ReportDashboard (`ReportDashboard.tsx`)
- **Purpose**: Display analysis results
- **Features**:
  - 4 key metrics cards
  - Risk findings display
  - Severity badges
  - Export functionality
  - Color-coded severity levels

### 5. TimelineSection (`TimelineSection.tsx`)
- **Purpose**: Show document event history
- **Features**:
  - Chronological event timeline
  - Event type indicators
  - Colored markers
  - Summary statistics
  - Amendment tracking

### 6. Footer Component (`Footer.tsx`)
- **Purpose**: Site footer with links
- **Features**:
  - Multiple link sections
  - Copyright information
  - Support links

## 🔧 Backend Modules

### 1. Main Application (`app/main.py`)
- FastAPI app initialization
- CORS middleware configuration
- Global exception handling
- Health check endpoints
- Root endpoint

### 2. Routes (`app/routes.py`)
**Endpoints:**
- `POST /api/upload` - Upload and process PDF
- `POST /api/analyze/{file_id}` - Analyze document
- `POST /api/reports/{file_id}` - Generate report
- `GET /api/documents/{file_id}` - Get status
- `GET /api/reports/{report_id}` - Retrieve report
- `GET /health` - Health check
- `GET /` - API info

**In-memory Storage:**
- `documents_db` - Uploaded documents
- `analyses_db` - Analysis results
- `reports_db` - Generated reports

### 3. File Service (`app/services/file_service.py`)
**Methods:**
- `save_upload_file()` - Save uploaded file to disk
- `extract_text_from_pdf()` - Extract text using PyPDF2
- `get_file_info()` - Get file metadata

### 4. AI Service (`app/services/ai_service.py`)
**Methods:**
- `analyze_legal_document()` - OpenAI analysis
- `extract_entities()` - Entity extraction
- `generate_report()` - Report generation
- Mock methods for testing without API key

### 5. Models (`app/models.py`)
**Pydantic Models:**
- `UploadResponse` - Upload result schema
- `AnalysisResponse` - Analysis result schema
- `ReportResponse` - Report result schema
- `ReportRequest` - Report request schema
- `HealthResponse` - Health check schema

### 6. Configuration (`app/config.py`)
**Settings:**
- API configuration
- Server settings
- OpenAI settings
- File upload limits
- CORS origins

## 🎨 Frontend Styling

### Tailwind CSS Configuration
- **Dark Theme**: 900-level colors for dark background
- **Glass Effect**: Custom class with blur and transparency
- **Animations**: Custom keyframes for flow and float effects
- **Gradients**: Multi-color gradient utilities

### Design System
- **Primary Colors**: Blue, Purple, Pink
- **Secondary Colors**: Gray tones
- **Glassmorphism**: 10px blur with 5% opacity
- **Spacing**: Consistent padding/margins
- **Typography**: System font stack

## 🔄 Data Flow

### Upload Flow
```
1. User selects PDF file
2. Frontend validates file
3. Frontend sends to /api/upload
4. Backend saves file
5. Backend extracts text from PDF
6. Backend returns file_id
7. Frontend stores file_id
8. User proceeds to workflow
```

### Analysis Flow
```
1. User clicks "Analyze"
2. Frontend sends to /api/analyze/{file_id}
3. Backend extracts entities
4. Backend analyzes with OpenAI
5. Backend generates report
6. Backend returns results
7. Frontend displays in dashboard
```

### Report Flow
```
1. User clicks "Export Report"
2. Frontend sends to /api/reports/{file_id}
3. Backend compiles report
4. Backend returns report_id
5. Frontend can retrieve full report
6. User downloads/views report
```

## 🔐 Security Features

### Frontend
- Input validation before upload
- File type checking
- Size limit enforcement
- XSS protection via React

### Backend
- CORS configuration
- File upload validation
- API key protection
- Error handling
- Rate limiting ready

## 📊 Performance Considerations

### Frontend
- Code splitting with Next.js
- Image optimization
- CSS-in-JS for smaller bundle
- Component lazy loading ready

### Backend
- Async/await for non-blocking I/O
- In-memory caching (demo mode)
- Connection pooling ready
- Request validation upfront

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] Set environment variables
- [ ] Configure domain
- [ ] Enable analytics
- [ ] Set up CI/CD

### Backend (Railway/Render)
- [ ] Set OPENAI_API_KEY
- [ ] Configure database
- [ ] Set up SSL
- [ ] Enable logging

## 📚 File Structure Reference

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── Header.tsx
│   ├── UploadSection.tsx
│   ├── WorkflowSection.tsx
│   ├── ReportDashboard.tsx
│   ├── TimelineSection.tsx
│   └── Footer.tsx
└── lib/                     # Utilities (add as needed)

backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── routes.py            # API endpoints
│   ├── models.py            # Pydantic models
│   ├── config.py            # Configuration
│   └── services/
│       ├── file_service.py
│       ├── ai_service.py
│       └── __init__.py
├── uploads/                 # Uploaded files
├── requirements.txt
├── main.py                  # Entry point
├── .env.example
└── Dockerfile
```

## 🔌 Integration Points

### OpenAI API
- Model: gpt-4
- Methods: text analysis, entity extraction, report generation
- Fallback: Mock responses for testing

### PDF Processing
- Library: PyPDF2
- Supports: Standard PDF documents
- Extracts: Text content with page tracking

## 💡 Extension Ideas

1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **Authentication**: Add user authentication
3. **File Storage**: Integrate S3/Cloud storage
4. **Advanced NLP**: Add spaCy for entity recognition
5. **Document Processing**: Add DOCX/TXT support
6. **Webhooks**: Add webhook support for async processing
7. **Batch Processing**: Handle multiple documents
8. **Caching**: Add Redis for performance

---

Built with ❤️ for legal professionals
