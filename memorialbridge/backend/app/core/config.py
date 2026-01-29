"""
Configuration module for the application.
Handles environment variables and app settings.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/memorialbridge"
    
    # CORS (comma-separated origins for production, e.g. https://memorialbridge-web.onrender.com)
    CORS_ORIGINS: str = ""
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Application
    APP_TITLE: str = "Memorial Bridge API"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # File uploads
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    UPLOAD_DIR: str = "uploads"
    ALLOWED_IMAGE_TYPES: list = ["image/jpeg", "image/png", "image/webp"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def get_database_url(self) -> str:
        """Return DATABASE_URL, converting postgresql:// to postgresql+asyncpg:// for async drivers."""
        url = self.DATABASE_URL
        if url.startswith("postgresql://") and "asyncpg" not in url:
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    def get_cors_origins_list(self) -> list[str]:
        """Return CORS origins as a list (local dev + CORS_ORIGINS)."""
        local = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        if not self.CORS_ORIGINS.strip():
            return local
        extra = [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
        return local + extra


@lru_cache()
def get_settings():
    """Get settings instance (cached)."""
    return Settings()
