import os
from typing import List
from dotenv import load_dotenv


load_dotenv()


def _get_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def _get_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def _get_list(name: str, default: List[str]) -> List[str]:
    value = os.getenv(name)
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    API_TITLE: str = os.getenv("API_TITLE", "LegalIntel AI API")
    API_VERSION: str = os.getenv("API_VERSION", "1.0.0")
    
    # Server
    DEBUG: bool = _get_bool("DEBUG", True)
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = _get_int("PORT", 8000)
    
    # CORS
    CORS_ORIGINS: List[str] = _get_list("CORS_ORIGINS", [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8001",
        "http://127.0.0.1:3000",
    ])
    
    # OpenAI
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "auto").lower()
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")

    # Google Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Apify
    APIFY_API_TOKEN: str = os.getenv("APIFY_API_TOKEN", "")
    APIFY_SEARCH_ACTOR_ID: str = os.getenv(
        "APIFY_SEARCH_ACTOR_ID",
        "apify/google-search-scraper"
    )
    APIFY_MAX_RESULTS: int = _get_int("APIFY_MAX_RESULTS", 5)

    # Zynd AI
    ZYND_REGISTRY_URL: str = os.getenv("ZYND_REGISTRY_URL", "https://zns01.zynd.ai")
    ZYND_AGENT_NAME: str = os.getenv("ZYND_AGENT_NAME", "legalintel-investigator")
    ZYND_AGENT_URL: str = os.getenv("ZYND_AGENT_URL", "http://localhost:8000")
    ZYND_ENABLED: bool = _get_bool("ZYND_ENABLED", True)

    # Superplane
    SUPERPLANE_ENABLED: bool = _get_bool("SUPERPLANE_ENABLED", True)
    SUPERPLANE_CANVAS_NAME: str = os.getenv(
        "SUPERPLANE_CANVAS_NAME",
        "LegalIntel Agent Review Pipeline"
    )
    
    # File handling
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = _get_int("MAX_FILE_SIZE", 50 * 1024 * 1024)
    ALLOWED_EXTENSIONS: list = ["pdf"]


settings = Settings()
