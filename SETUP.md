# Installation & Setup Guide

Complete step-by-step guide to set up LegalIntel AI locally.

## Prerequisites

- **Node.js**: 18.0 or higher
- **Python**: 3.9 or higher
- **npm** or **yarn**: Latest version
- **OpenAI API Key**: Get one at https://platform.openai.com/account/api-keys

## 🖥️ Backend Setup (FastAPI)

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
DEBUG=True
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### Step 5: Run Backend Server

```bash
python -m uvicorn app.main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Application startup complete
```

✅ Backend is now running at: **http://localhost:8000**

To verify:
- Visit: http://localhost:8000/docs (Swagger UI)
- Or: http://localhost:8000/health (Health check)

---

## 🌐 Frontend Setup (Next.js)

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### Step 3: Configure Environment

```bash
cp .env.local.example .env.local
```

The default configuration should work:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Run Development Server

```bash
npm run dev
```

Expected output:
```
> legal-intel-frontend@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.1s
```

✅ Frontend is now running at: **http://localhost:3000**

---

## 🚀 Start Using the Application

### 1. Open Frontend
Visit **http://localhost:3000** in your browser

### 2. Upload a PDF
- Click the upload area or select a file
- Drag and drop a legal document (PDF format)
- Click "Upload & Analyze"

### 3. View Processing
- Watch the animated workflow showing the 6-step analysis
- See real-time progress tracking

### 4. View Results
- Check the dashboard for metrics and findings
- Review the timeline of document events
- Export the full report

---

## 🐳 Docker Setup (Optional)

### Using Docker Compose

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key-here

# Run all services
docker-compose up
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 🧪 Testing the API

### Using Swagger UI (Recommended)
1. Visit: http://localhost:8000/docs
2. Click "Try it out" on any endpoint
3. Fill in parameters and click "Execute"

### Using cURL

**Upload a PDF:**
```bash
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@/path/to/document.pdf"
```

**Get Health Status:**
```bash
curl http://localhost:8000/health
```

**Check API Info:**
```bash
curl http://localhost:8000/
```

---

## 🔧 Troubleshooting

### Issue: "Port 3000/8000 already in use"

**Find and kill process (Windows):**
```bash
netstat -ano | findstr :3000
taskkill /PID {PID} /F
```

**Find and kill process (macOS/Linux):**
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: "ModuleNotFoundError" in Backend

Ensure virtual environment is activated:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

Then reinstall dependencies:
```bash
pip install -r requirements.txt
```

### Issue: "OpenAI API Error"

1. Verify API key is set in `.env`
2. Check key format: Should start with `sk-`
3. Test at: https://platform.openai.com/account/api-keys
4. Ensure account has credits

### Issue: CORS Errors

Backend must allow frontend origin in `.env`:
```
CORS_ORIGINS=http://localhost:3000
```

Restart backend after changes.

### Issue: PDF Upload Fails

- Check file is valid PDF
- Verify file size < 50MB
- Ensure backend is running
- Check browser console for errors

---

## 📁 Project Structure After Setup

```
LegalIntelAI/
├── frontend/
│   ├── .next/              # Build artifacts
│   ├── node_modules/       # Dependencies
│   ├── .env.local          # Environment config
│   └── [source files]
├── backend/
│   ├── venv/               # Virtual environment
│   ├── uploads/            # Uploaded files
│   ├── .env                # Environment config
│   └── [source files]
└── [documentation files]
```

---

## ✨ Quick Commands Reference

### Frontend
```bash
# Development
npm run dev

# Production build
npm run build

# Run production server
npm start

# Lint
npm run lint
```

### Backend
```bash
# Development (with auto-reload)
python -m uvicorn app.main:app --reload

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Run with main.py
python main.py
```

### Both
```bash
# Clean everything and restart
rm -rf node_modules venv uploads
npm install
python -m venv venv
pip install -r requirements.txt
```

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **OpenAI API**: https://platform.openai.com/docs

---

## 🆘 Getting Help

### Check Logs
- **Frontend**: Open browser DevTools (F12)
- **Backend**: Check terminal output

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Health Checks
```bash
# Backend health
curl http://localhost:8000/health

# Frontend accessibility
curl http://localhost:3000
```

---

## ✅ Verification Checklist

- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] OpenAI API key obtained
- [ ] `.env` file created in backend
- [ ] `.env.local` file created in frontend
- [ ] Backend server running (port 8000)
- [ ] Frontend dev server running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/docs

All checked? You're ready to go! 🎉

---

Happy coding! For questions or issues, refer to QUICKSTART.md or ARCHITECTURE.md
