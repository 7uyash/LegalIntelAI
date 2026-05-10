# Development Guide - NyayaViveka AI Investigator

Complete development environment setup, contribution guidelines, and coding standards.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Running Tests](#running-tests)
5. [Debugging](#debugging)
6. [Contributing](#contributing)
7. [Common Tasks](#common-tasks)

---

## Development Environment Setup

### Prerequisites

- **Git**: Version control
- **Python 3.12+**: Backend runtime
- **Node.js 18+**: Frontend runtime
- **VS Code**: Recommended editor
- **Docker** (optional): Containerization

### Initial Setup

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/LegalIntelAI.git
cd LegalIntelAI
```

#### 2. Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install -r requirements-dev.txt

# Create .env file
cp .env.example .env
# Edit with your API keys
```

#### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local

# Install VS Code extensions (recommended)
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension GitHub.copilot
```

#### 4. Verify Installation

```bash
# Backend
cd backend
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"

# Frontend
cd frontend
npm --version
```

---

## Project Structure

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration
│   ├── models.py            # Pydantic models
│   ├── routes.py            # API routes
│   ├── services/
│   │   ├── __init__.py
│   │   ├── file_service.py
│   │   ├── ai_service.py
│   │   ├── apify_service.py
│   │   ├── agent_orchestrator.py
│   │   ├── contradiction_detector.py
│   │   ├── timeline_service.py
│   │   └── report_service.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py          # Pytest configuration
├── uploads/                 # Uploaded files
├── logs/                    # Application logs
├── main.py                  # Entry point
├── requirements.txt         # Dependencies
├── requirements-dev.txt     # Dev dependencies
├── pytest.ini               # Pytest config
└── Dockerfile
```

### Frontend Structure

```
frontend/
├── app/
│   ├── page.tsx            # Main page
│   ├── layout.tsx          # Layout wrapper
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx
│   ├── UploadSection.tsx
│   ├── WorkflowSection.tsx
│   ├── AgentWorkflow.tsx
│   ├── ReportDashboard.tsx
│   ├── TimelineSection.tsx
│   └── Footer.tsx
├── services/
│   └── api.ts              # API client
├── lib/
│   └── utils.ts            # Utility functions
├── styles/
│   ├── globals.css
│   └── variables.css
├── public/
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── Dockerfile
```

---

## Coding Standards

### Backend (Python)

#### Style Guide

Follow PEP 8 with Black formatter:

```bash
# Format code
black backend/

# Check formatting
black --check backend/

# Lint code
pylint backend/

# Type checking
mypy backend/
```

#### Code Example

```python
# Good: Clear, typed, documented
from typing import Dict, Optional
from app.config import settings
from app.models import Document

async def process_document(file_path: str) -> Dict[str, str]:
    """
    Process uploaded PDF document.
    
    Args:
        file_path: Path to uploaded PDF file
    
    Returns:
        Dictionary with extracted text and metadata
    
    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If file is not valid PDF
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    try:
        text = extract_pdf_text(file_path)
        return {
            "status": "success",
            "text": text,
            "pages": count_pages(file_path)
        }
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        raise ValueError(f"Invalid PDF file: {str(e)}")
```

#### File Naming
- `snake_case` for files: `file_service.py`
- `PascalCase` for classes: `class FileService`
- `snake_case` for functions: `def extract_text()`
- `UPPER_CASE` for constants: `MAX_FILE_SIZE = 50MB`

### Frontend (TypeScript/React)

#### Style Guide

Use Prettier and ESLint:

```bash
# Format code
npx prettier --write .

# Lint code
npm run lint

# Fix issues
npm run lint -- --fix
```

#### Code Example

```typescript
// Good: Typed, documented, clean
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface UploadSectionProps {
  onUploadSuccess: (fileId: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUploadSuccess 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle file drop
   */
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  /**
   * Upload file to backend
   */
  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      onUploadSuccess(response.data.file_id);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Component JSX */}
    </motion.div>
  );
};
```

#### File Naming
- `PascalCase` for components: `UploadSection.tsx`
- `camelCase` for utilities: `apiClient.ts`
- `camelCase` for functions: `const handleUpload = () => {}`
- `UPPER_CASE` for constants: `const MAX_FILE_SIZE = 50;`

---

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_file_service.py

# Run with coverage
pytest --cov=app tests/

# Run with verbose output
pytest -v

# Run tests matching pattern
pytest -k "test_upload"

# Run tests and show print statements
pytest -s
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- UploadSection.test.tsx
```

### Test Structure

```python
# backend/tests/unit/test_file_service.py

import pytest
from app.services.file_service import FileService

class TestFileService:
    """Test suite for FileService"""
    
    @pytest.fixture
    def file_service(self):
        """Create FileService instance"""
        return FileService()
    
    def test_extract_text_valid_pdf(self, file_service, tmp_path):
        """Test PDF text extraction with valid file"""
        # Arrange
        pdf_path = tmp_path / "test.pdf"
        # ... create test PDF
        
        # Act
        result = file_service.extract_text_from_pdf(str(pdf_path))
        
        # Assert
        assert result['success'] is True
        assert len(result['text']) > 0
        assert result['pages'] > 0
    
    def test_extract_text_invalid_pdf(self, file_service):
        """Test PDF extraction with invalid file"""
        # Arrange & Act & Assert
        with pytest.raises(ValueError):
            file_service.extract_text_from_pdf("invalid.pdf")
```

---

## Debugging

### Backend Debugging

#### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app.main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8001"
      ],
      "jinja": true,
      "justMyCode": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

#### Using Python Debugger

```python
# Add breakpoint in code
import pdb; pdb.set_trace()

# Or use built-in breakpoint()
breakpoint()  # Python 3.7+
```

#### Logging

```python
import logging

logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical message")
```

### Frontend Debugging

#### Browser DevTools

```javascript
// Use console logging
console.log('Debug message:', data);
console.error('Error:', error);
console.table(arrayOfObjects);

// Debugger statement
debugger;  // Pauses execution
```

#### React DevTools Extension

1. Install "React Developer Tools" extension
2. Open DevTools → Components/Profiler tabs
3. Inspect components and hooks

---

## Contributing

### Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/agent-name
   git checkout -b fix/bug-name
   git checkout -b docs/improvements
   ```

2. **Make Changes**
   - Write code following style guide
   - Add tests for new features
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add legal research agent"
   ```

   Commit message format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for code restructuring

4. **Push Changes**
   ```bash
   git push origin feature/agent-name
   ```

5. **Create Pull Request**
   - Describe what changed
   - Link related issues
   - Request review

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security reviewed

---

## Common Tasks

### Add New Backend Service

```python
# backend/app/services/new_service.py

from app.config import settings
import logging

logger = logging.getLogger(__name__)

class NewService:
    """Description of service"""
    
    def __init__(self):
        self.config = settings
    
    async def do_something(self, data: Dict):
        """Method description"""
        try:
            result = await self._process(data)
            logger.info(f"Processing complete: {result}")
            return result
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            raise
    
    async def _process(self, data: Dict) -> Dict:
        """Internal method"""
        # Implementation
        pass
```

### Add New Frontend Component

```typescript
// frontend/components/NewComponent.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NewComponentProps {
  title: string;
  onAction?: (data: any) => void;
}

export const NewComponent: React.FC<NewComponentProps> = ({ 
  title, 
  onAction 
}) => {
  const [state, setState] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-lg bg-dark-800"
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {/* Component content */}
    </motion.div>
  );
};
```

### Add New API Endpoint

```python
# backend/app/routes.py

from fastapi import APIRouter
from app.services.file_service import FileService

router = APIRouter(prefix="/api", tags=["api"])

@router.post("/new-endpoint")
async def new_endpoint(data: Dict) -> Dict:
    """
    New endpoint description.
    
    Args:
        data: Request data
    
    Returns:
        Response data
    """
    service = FileService()
    result = await service.process(data)
    return {"status": "success", "data": result}
```

### Run Local Servers

```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Tests
cd backend
pytest -s
```

---

## Useful Commands

### Backend

```bash
# Format code
black backend/

# Lint code
pylint backend/

# Type check
mypy backend/

# Run server with reload
python main.py

# View logs
tail -f logs/app.log

# Database migration (future)
alembic upgrade head
```

### Frontend

```bash
# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Start production build
npm start

# Type check
npm run type-check
```

### Git

```bash
# View git log
git log --oneline -10

# Revert changes
git revert <commit-hash>

# Stash changes
git stash

# View diff
git diff
```

---

## Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Documentation**: https://react.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **OpenAI API**: https://platform.openai.com/docs/api-reference
- **Apify Documentation**: https://docs.apify.com/
- **Pytest Documentation**: https://docs.pytest.org/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
