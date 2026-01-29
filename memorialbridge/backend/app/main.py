"""Main FastAPI application."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import engine
from app.models import Base
from app.api.v1.endpoints import auth, memorial, comment, charity, donation

settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="Memorial Bridge API - Preserve Memories, Inspire Legacy"
)

# CORS middleware (allow_credentials=True requires explicit origins, not "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database tables
@app.on_event("startup")
async def startup():
    """Initialize database on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Include routers
from app.api.v1.endpoints import admin, subscription

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(memorial.router, prefix=settings.API_V1_STR)
app.include_router(comment.router, prefix=settings.API_V1_STR)
app.include_router(charity.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(subscription.router, prefix=settings.API_V1_STR)
app.include_router(donation.router, prefix=settings.API_V1_STR)

# Serve uploaded files (images) at /uploads
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Memorial Bridge API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
