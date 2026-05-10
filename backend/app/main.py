from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
from app.config import settings
from app.routes import router
from app.services.zynd_service import ZyndService

# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="AI-powered legal investigation and document analysis platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)
zynd_service = ZyndService()


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "LegalIntel AI API",
        "version": settings.API_VERSION,
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": settings.API_VERSION
    }


@app.get("/.well-known/agent.json")
async def zynd_agent_card():
    """Zynd-compatible agent card for registry/deployer discovery"""
    return zynd_service.agent_card()


@app.post("/webhook/sync")
async def zynd_sync_webhook(request: Request):
    """Zynd-compatible synchronous webhook entrypoint"""
    payload = await request.json()
    return await zynd_service.handle_sync(payload)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
