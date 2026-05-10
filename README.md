# LegalIntel AI - Advanced Legal Investigation Platform

An AI-powered platform for comprehensive legal document analysis and investigation using modern technologies.

## 🚀 Features

### Frontend
- **Modern Dark Theme** - Sleek glassmorphism UI with smooth animations
- **Document Upload** - Drag-and-drop PDF upload with validation
- **Animated Workflow** - Real-time AI agent workflow visualization
- **Report Dashboard** - Comprehensive analysis metrics and findings
- **Timeline Section** - Document event timeline and history tracking
- **Responsive Layout** - Works seamlessly on all devices

### Backend
- **FastAPI Framework** - High-performance async Python API
- **PDF Processing** - Extract and analyze legal document content
- **OpenAI Integration** - GPT-4 powered legal analysis
- **CORS Enabled** - Secure cross-origin requests
- **Report Generation** - Comprehensive analysis reports
- **Entity Extraction** - Identify parties, terms, and obligations

## 📁 Project Structure

```
LegalIntelAI/
├── frontend/                 # Next.js + Tailwind frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities and helpers
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── README.md
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── routes.py       # API routes
│   │   ├── models.py       # Pydantic models
│   │   ├── config.py       # Configuration
│   │   └── services/       # Business logic
│   ├── uploads/            # Uploaded files
│   ├── requirements.txt
│   ├── main.py
│   └── README.md
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Static type checking
- **Framer Motion** - Advanced animations
- **Axios** - HTTP client
- **Lucide Icons** - Beautiful icons

### Backend
- **FastAPI** - Modern async Python web framework
- **Uvicorn** - ASGI server
- **PyPDF2** - PDF processing
- **OpenAI** - GPT-4 integration
- **Pydantic** - Data validation
- **Python 3.9+** - Programming language

## ⚙️ Installation

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- OpenAI API key

### Frontend Setup

```bash
cd frontend
npm install
# or
yarn install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # macOS/Linux

pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your OpenAI API key
```

## 🚀 Running the Application

### Frontend (in one terminal)

```bash
cd frontend
npm run dev
```
Access at: http://localhost:3000

### Backend (in another terminal)

```bash
cd backend
python -m uvicorn app.main:app --reload
```
Access at: http://localhost:8000

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload PDF document |
| POST | `/api/analyze/{file_id}` | Analyze document |
| POST | `/api/reports/{file_id}` | Generate report |
| GET | `/api/documents/{file_id}` | Get document status |
| GET | `/health` | Health check |

## 🎨 UI Features

### Glassmorphism Design
- Semi-transparent components with blur effects
- Gradient accents and animations
- Dark theme with purple/blue color scheme
- Smooth transitions and interactions

### Responsive Components
- Mobile-first approach
- Breakpoints at 640px, 768px, 1024px
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔐 Security

- CORS configuration for secure API access
- Environment variables for sensitive data
- Request validation with Pydantic
- File upload validation and limits
- Error handling and logging

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
OPENAI_API_KEY=sk-your-key-here
DEBUG=True
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway/Render/Heroku)
```bash
# Push to your hosting platform
```

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.
