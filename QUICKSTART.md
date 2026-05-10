# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Option 1: Local Development (Recommended)

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Or (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run server
python -m uvicorn app.main:app --reload
```

✅ Backend running at: http://localhost:8000

#### 2. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# (Optional) Edit if backend is on different URL

# Run dev server
npm run dev
```

✅ Frontend running at: http://localhost:3000

### Option 2: Docker Compose

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key-here

# Run all services
docker-compose up
```

✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:8000

## 📝 First Steps

1. **Open Frontend** - Navigate to http://localhost:3000
2. **Upload PDF** - Use the upload section to select a PDF file
3. **Process Document** - Click "Upload & Analyze"
4. **View Results** - Check workflow, dashboard, and timeline sections

## 🔑 Get OpenAI API Key

1. Visit https://platform.openai.com/account/api-keys
2. Create new secret key
3. Copy and paste into `.env` file (Backend)

## 🛠 Useful Commands

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm start          # Start production server
```

### Backend
```bash
# Development
python -m uvicorn app.main:app --reload

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# View API docs
# http://localhost:8000/docs
```

## 📚 API Testing

### Using cURL

```bash
# Upload file
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@sample.pdf"

# Analyze document
curl -X POST "http://localhost:8000/api/analyze/{file_id}"

# Get health status
curl http://localhost:8000/health
```

### Using Swagger UI
Navigate to: http://localhost:8000/docs

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### OpenAI API Key Error
- Verify key is correctly set in `.env`
- Check key format starts with `sk-`
- Ensure API has credits available

### CORS Errors
- Check `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL is in the list
- Restart backend after changes

## 📞 Need Help?

- Check backend logs: http://localhost:8000/health
- Check browser console for frontend errors
- Review API documentation: http://localhost:8000/docs

Happy coding! 🎉
