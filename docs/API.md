# API Documentation - NyayaViveka AI Investigator

Complete API reference for all endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:8001
```

## Authentication

Currently no authentication required. Production version will use JWT tokens.

## Response Format

All responses are JSON-formatted. Successful responses return data with HTTP 200-201. Errors return appropriate status codes with error messages.

---

## Core Endpoints

### Health & Status

#### GET /
Returns API information and status.

**Response**: 200 OK
```json
{
  "message": "LegalIntel AI API",
  "version": "1.0.0",
  "status": "running",
  "timestamp": "2026-05-10T12:14:01.965459"
}
```

#### GET /health
Health check endpoint for monitoring.

**Response**: 200 OK
```json
{
  "status": "healthy",
  "timestamp": "2026-05-10T12:09:21.131557",
  "version": "1.0.0"
}
```

---

## Document Management

### POST /api/upload
Upload and process a PDF document.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```
  file: <PDF file>
  ```

**Example**:
```bash
curl -X POST http://localhost:8001/api/upload \
  -F "file=@document.pdf"
```

**Response**: 200 OK
```json
{
  "file_id": "file_123456",
  "filename": "document.pdf",
  "size": 1024000,
  "pages": 5,
  "upload_time": "2026-05-10T12:10:00",
  "status": "uploaded",
  "text_extracted": true,
  "message": "File uploaded and processed successfully"
}
```

**Error Responses**:
```json
// 400 Bad Request - Invalid file
{
  "detail": "Invalid file type. Only PDF files are allowed."
}

// 413 Payload Too Large
{
  "detail": "File size exceeds maximum limit of 50MB"
}

// 500 Internal Server Error
{
  "detail": "Error processing file. Please try again."
}
```

### GET /api/documents/{file_id}
Get document status and metadata.

**Request**:
- Method: `GET`
- Parameters:
  - `file_id` (path): Document ID from upload

**Example**:
```bash
curl http://localhost:8001/api/documents/file_123456
```

**Response**: 200 OK
```json
{
  "file_id": "file_123456",
  "filename": "document.pdf",
  "upload_time": "2026-05-10T12:10:00",
  "status": "analyzed",
  "pages": 5,
  "file_size": 1024000,
  "analysis_status": "completed",
  "report_generated": true,
  "metadata": {
    "extracted_text_preview": "The complainant states...",
    "entity_count": 15,
    "issue_count": 4
  }
}
```

---

## Analysis & Investigation

### POST /api/analyze/{file_id}
Trigger multi-agent analysis on an uploaded document.

**Request**:
- Method: `POST`
- Parameters:
  - `file_id` (path): Document ID
- Optional Body:
  ```json
  {
    "include_web_investigation": true,
    "include_contradiction_detection": true,
    "include_timeline": true,
    "include_risk_assessment": true
  }
  ```

**Example**:
```bash
curl -X POST http://localhost:8001/api/analyze/file_123456 \
  -H "Content-Type: application/json" \
  -d '{
    "include_web_investigation": true,
    "include_timeline": true
  }'
```

**Response**: 200 OK
```json
{
  "analysis_id": "analysis_789",
  "file_id": "file_123456",
  "status": "in-progress",
  "agents_active": [
    "orchestrator",
    "legal_research",
    "evidence_collection",
    "contradiction_detection",
    "timeline_reconstruction",
    "risk_assessment"
  ],
  "progress": {
    "completed_agents": 2,
    "total_agents": 6,
    "estimated_completion": "2026-05-10T12:15:00"
  },
  "legal_issues": [
    {
      "issue": "Fraud allegation",
      "severity": "high",
      "description": "Document indicates potential fraudulent transactions"
    },
    {
      "issue": "Breach of contract",
      "severity": "medium",
      "description": "Payment obligations not fulfilled"
    }
  ]
}
```

### POST /api/investigate/{file_id}
Start live web investigation for evidence gathering.

**Request**:
- Method: `POST`
- Parameters:
  - `file_id` (path): Document ID
- Body:
  ```json
  {
    "investigation_type": "entity_background",
    "search_queries": ["company_name", "person_name"],
    "include_news": true,
    "include_public_records": true
  }
  ```

**Example**:
```bash
curl -X POST http://localhost:8001/api/investigate/file_123456 \
  -H "Content-Type: application/json" \
  -d '{
    "investigation_type": "entity_background",
    "search_queries": ["ABC Corporation"],
    "include_news": true
  }'
```

**Response**: 200 OK
```json
{
  "investigation_id": "inv_555",
  "file_id": "file_123456",
  "status": "in-progress",
  "investigation_type": "entity_background",
  "queries": ["ABC Corporation"],
  "sources_found": 24,
  "web_evidence": [
    {
      "title": "ABC Corporation Regulatory Filing",
      "url": "https://example.com/filing",
      "date": "2026-05-01",
      "relevance": 0.95,
      "snippet": "The company filed..."
    }
  ],
  "estimated_completion": "2026-05-10T12:20:00"
}
```

---

## Reports

### POST /api/reports/{file_id}
Generate intelligence report for analyzed document.

**Request**:
- Method: `POST`
- Parameters:
  - `file_id` (path): Document ID
- Optional Body:
  ```json
  {
    "include_summary": true,
    "include_findings": true,
    "include_timeline": true,
    "include_risk_assessment": true,
    "include_recommendations": true,
    "format": "json"
  }
  ```

**Example**:
```bash
curl -X POST http://localhost:8001/api/reports/file_123456 \
  -H "Content-Type: application/json"
```

**Response**: 200 OK
```json
{
  "report_id": "report_123",
  "file_id": "file_123456",
  "analysis_id": "analysis_789",
  "generated_at": "2026-05-10T12:15:00",
  "status": "completed",
  "case_summary": {
    "title": "FIR Analysis - Fraud Investigation",
    "description": "Multi-agent investigation of alleged fraudulent transactions",
    "severity_score": 8.5,
    "case_status": "High Risk"
  },
  "legal_issues": [
    {
      "issue": "Fraud allegation",
      "severity": "high",
      "evidence": "Multiple discrepancies in transaction records",
      "legal_reference": "IPC Section 420"
    }
  ],
  "entities_identified": 15,
  "contradictions_found": 3,
  "timeline": [
    {
      "date": "2026-04-01",
      "event": "Initial transaction",
      "type": "transaction",
      "status": "verified"
    }
  ],
  "risk_assessment": {
    "fraud_likelihood": 0.87,
    "legal_complexity": "high",
    "compliance_risk": "medium",
    "overall_score": 8.5
  },
  "recommendations": [
    "Initiate legal proceedings",
    "Freeze accounts pending investigation",
    "Gather additional transaction records"
  ]
}
```

### GET /api/reports/{report_id}
Retrieve previously generated report.

**Request**:
- Method: `GET`
- Parameters:
  - `report_id` (path): Report ID from generation

**Example**:
```bash
curl http://localhost:8001/api/reports/report_123
```

**Response**: 200 OK
```json
{
  "report_id": "report_123",
  "file_id": "file_123456",
  "generated_at": "2026-05-10T12:15:00",
  "case_summary": {
    "title": "FIR Analysis - Fraud Investigation",
    "severity_score": 8.5
  },
  "legal_issues": [...],
  "timeline": [...],
  "risk_assessment": {...}
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "detail": "Error message describing what went wrong",
  "status_code": 400,
  "timestamp": "2026-05-10T12:10:00"
}
```

### Common Status Codes

| Code | Meaning | Common Cause |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid parameters |
| 404 | Not Found | Resource doesn't exist |
| 413 | Payload Too Large | File exceeds size limit |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | API temporarily down |

---

## Request/Response Models

### Document Model
```json
{
  "file_id": "string",
  "filename": "string",
  "upload_time": "ISO8601 timestamp",
  "status": "uploaded | analyzed | error",
  "pages": "integer",
  "file_size": "integer (bytes)",
  "raw_text": "string",
  "metadata": {
    "extracted_text_preview": "string",
    "entity_count": "integer",
    "issue_count": "integer"
  }
}
```

### Analysis Model
```json
{
  "analysis_id": "string",
  "file_id": "string",
  "status": "pending | in-progress | completed | error",
  "legal_issues": [
    {
      "issue": "string",
      "severity": "low | medium | high",
      "description": "string"
    }
  ],
  "entities": [
    {
      "type": "person | organization | location | date",
      "value": "string",
      "confidence": "number (0-1)"
    }
  ],
  "contradictions": [
    {
      "type": "string",
      "description": "string",
      "severity": "low | medium | high"
    }
  ],
  "timeline": [
    {
      "date": "ISO8601 date",
      "event": "string",
      "type": "string",
      "status": "string"
    }
  ]
}
```

### Report Model
```json
{
  "report_id": "string",
  "file_id": "string",
  "analysis_id": "string",
  "generated_at": "ISO8601 timestamp",
  "case_summary": {
    "title": "string",
    "description": "string",
    "severity_score": "number (0-10)",
    "case_status": "string"
  },
  "legal_issues": ["array"],
  "entities_identified": "integer",
  "contradictions_found": "integer",
  "timeline": ["array"],
  "risk_assessment": {
    "fraud_likelihood": "number (0-1)",
    "legal_complexity": "low | medium | high",
    "compliance_risk": "low | medium | high",
    "overall_score": "number (0-10)"
  },
  "recommendations": ["array of strings"]
}
```

---

## Rate Limiting

Currently no rate limiting. Production deployment will implement:

```
- 100 requests per minute per IP
- 10 file uploads per hour per IP
- 5 analysis requests per minute per IP
```

---

## Pagination

For endpoints returning multiple items:

```bash
GET /api/documents?page=1&limit=10&sort=upload_time&order=desc
```

---

## WebSocket Support

Real-time analysis updates (future enhancement):

```javascript
const ws = new WebSocket('ws://localhost:8001/ws/analysis/analysis_789');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Agent progress:', update.progress);
};
```

---

## CORS

CORS enabled for:
- `http://localhost:3000`
- `http://localhost:8000`
- `http://127.0.0.1:3000`

Production deployment should restrict to specific domains.

---

## API Documentation UI

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

---

## Testing

### Using curl

```bash
# Upload document
curl -X POST http://localhost:8001/api/upload \
  -F "file=@test.pdf"

# Check health
curl http://localhost:8001/health

# Get document
curl http://localhost:8001/api/documents/file_123456
```

### Using Python

```python
import requests

# Upload
with open('test.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8001/api/upload', files=files)
    print(response.json())

# Get report
response = requests.get('http://localhost:8001/api/reports/report_123')
print(response.json())
```

### Using JavaScript

```javascript
// Upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8001/api/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.file_id);
```

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
