# Setup Guide - NyayaViveka AI Investigator

Complete installation and configuration guide for setting up the legal investigation platform.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Environment Configuration](#environment-configuration)
5. [Docker Setup](#docker-setup)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Software Prerequisites
- **Python**: 3.12+ (https://www.python.org/downloads/)
- **Node.js**: 18+ with npm (https://nodejs.org/)
- **Git**: Latest version (https://git-scm.com/)
- **Docker** (optional): Docker Desktop (https://www.docker.com/)

### API Keys Required
- **OpenAI API Key** (optional for testing): https://platform.openai.com/api-keys
- **Apify API Key** (for web investigation): https://apify.com/
- **Zynd AI Key** (for agent orchestration): https://www.zynd.ai/

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Python Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Expected output:
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 pydantic-2.4.2 ...
```

### Step 4: Verify Installation
```bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"
python -c "import openai; print(f'OpenAI {openai.__version__}')"
```

### Step 5: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Configuration](#environment-configuration) below).

### Step 6: Create Uploads Directory
```bash
mkdir uploads
```

### Step 7: Start Backend Server

**Development Mode:**
```bash
python main.py
```

**Production Mode (with reload):**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Expected output:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

### Step 8: Test Backend

In a new terminal:
```bash
curl http://localhost:8001/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2026-05-10T12:09:21.131557","version":"1.0.0"}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

Or with yarn:
```bash
yarn install
```

### Step 3: Create Environment File
```bash
cp .env.local.example .env.local
```

### Step 4: Verify Configuration

Edit `.env.local` to ensure backend URL is correct:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Step 5: Start Frontend Development Server
```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 14.2.35
  
  > Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 12.3s
```

### Step 6: Access Frontend

Open browser and navigate to:
```
http://localhost:3000
```

---

## Environment Configuration

### Backend (.env)

Create `backend/.env` with:

```env
# ===== OpenAI Configuration =====
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4

# ===== Apify Configuration (Optional) =====
APIFY_API_KEY=your-apify-key-here
APIFY_ENABLED=true

# ===== Zynd AI Configuration (Optional) =====
ZYND_API_KEY=your-zynd-key-here

# ===== Server Configuration =====
DEBUG=true
HOST=0.0.0.0
PORT=8001

# ===== CORS Configuration =====
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000","http://127.0.0.1:3000"]

# ===== File Handling =====
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800  # 50MB in bytes
ALLOWED_EXTENSIONS=["pdf"]
```

### Frontend (.env.local)

Create `frontend/.env.local` with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001

# Optional: Analytics or tracking
NEXT_PUBLIC_APP_ENV=development
```

### Getting API Keys

#### OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create new API key
3. Copy and paste in `.env`

#### Apify API Key
1. Sign up at https://apify.com/
2. Navigate to account settings
3. Copy API token
4. Add to `.env`

#### Zynd AI Key
1. Register at https://www.zynd.ai/
2. Get API credentials
3. Add to `.env`

---

## Docker Setup

### Using Docker Compose (Recommended)

#### Step 1: Build Images
```bash
docker-compose build
```

#### Step 2: Start Services
```bash
docker-compose up
```

#### Step 3: Verify Services

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:8001  
**API Docs**: http://localhost:8001/docs

#### Step 4: Stop Services
```bash
docker-compose down
```

### Building Individual Images

**Backend Image:**
```bash
docker build -t legalintel-backend:latest backend/
docker run -p 8001:8001 -e OPENAI_API_KEY=your-key legalintel-backend:latest
```

**Frontend Image:**
```bash
docker build -t legalintel-frontend:latest frontend/
docker run -p 3000:3000 legalintel-frontend:latest
```

---

## Troubleshooting

### Backend Issues

#### Error: ModuleNotFoundError: No module named 'fastapi'

**Solution**: Ensure virtual environment is activated
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Error: Port 8001 already in use

**Solution**: Kill process on port 8001
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <process-id> /F

# macOS/Linux
lsof -i :8001
kill -9 <process-id>
```

Or use different port:
```bash
python main.py --port 8002
```

#### Error: OPENAI_API_KEY not found

**Solution**: Ensure .env file exists and API key is set, or use mock responses
```bash
# Without API key, mock responses are used automatically
python main.py
```

#### Error: PDF extraction fails

**Solution**: Ensure PyPDF2 is installed
```bash
pip install PyPDF2==3.0.1 --force-reinstall
```

### Frontend Issues

#### Error: Cannot find module 'react'

**Solution**: Reinstall node modules
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: API not responding

**Solution**: Check backend is running
```bash
curl http://localhost:8001/health
```

If not running, start backend:
```bash
cd backend
python main.py
```

#### Error: Port 3000 already in use

**Solution**: Use different port
```bash
npm run dev -- -p 3001
```

### Docker Issues

#### Error: Docker daemon not running

**Solution**: Start Docker Desktop or Docker service
```bash
# macOS: Docker Desktop app
# Windows: Docker Desktop app
# Linux:
sudo systemctl start docker
```

#### Error: Cannot connect to Docker daemon

**Solution**: Check Docker is properly installed and running
```bash
docker --version
docker ps
```

---

## Verification Checklist

### Backend Verification
- [ ] Virtual environment activated
- [ ] Dependencies installed: `pip list | grep fastapi`
- [ ] `.env` file created and configured
- [ ] Server running: `http://localhost:8001`
- [ ] Health check passing: `curl http://localhost:8001/health`
- [ ] No errors in terminal

### Frontend Verification
- [ ] Node modules installed: `npm list react`
- [ ] `.env.local` file created
- [ ] Development server running: `http://localhost:3000`
- [ ] No build errors in terminal
- [ ] Can see upload section on page

### Integration Verification
- [ ] Both servers running simultaneously
- [ ] Frontend can communicate with backend
- [ ] API endpoints responsive
- [ ] No CORS errors in browser console

---

## Next Steps

1. **Review Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Explore API**: See [API.md](API.md)
3. **Understand Agents**: See [AGENTS.md](AGENTS.md)
4. **Deploy to Production**: See [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Start Development**: See [DEVELOPMENT.md](DEVELOPMENT.md)

---

## Support

If you encounter issues not covered here:
1. Check the [troubleshooting section](#troubleshooting)
2. Review terminal output for error messages
3. Verify all prerequisites are installed
4. Check documentation in `docs/` directory
5. Open an issue on GitHub

---

**Last Updated**: May 10, 2026  
**Version**: 1.0.0
