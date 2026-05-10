# Backend for LegalIntel AI

AI-powered legal investigation and document analysis platform backend.

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # macOS/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 4. Run Server

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Document Upload
- **POST** `/api/upload` - Upload PDF document
- **GET** `/api/documents/{file_id}` - Get document status

### Analysis
- **POST** `/api/analyze/{file_id}` - Analyze uploaded document
- **GET** `/health` - Health check
- **GET** `/` - API info

### Reports
- **POST** `/api/reports/{file_id}` - Generate report
- **GET** `/api/reports/{report_id}` - Retrieve report

## Features

- ✅ PDF upload and processing
- ✅ Text extraction from PDFs
- ✅ OpenAI integration for legal analysis
- ✅ Entity recognition and extraction
- ✅ Report generation
- ✅ CORS enabled
- ✅ Comprehensive error handling
