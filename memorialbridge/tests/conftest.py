"""
Pytest configuration and fixtures for all tests.
Provides database setup, client fixtures, and authentication helpers.
"""
import asyncio
from typing import AsyncGenerator, Generator
import sys
from pathlib import Path
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from fastapi.testclient import TestClient
from httpx import AsyncClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.main import app
from app.db.session import get_db
from app.models import Base
from app.core.security import create_access_token

# Test database URL (SQLite in-memory for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for each test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def test_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a fresh in-memory SQLite database for each test.
    Ensures test isolation and no data persistence between tests.
    """
    # Create async engine
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session

    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
def db_override(test_db):
    """Override the database dependency for testing."""

    async def get_test_db():
        yield test_db

    app.dependency_overrides[get_db] = get_test_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def client(db_override) -> TestClient:
    """Create a FastAPI test client with database overrides."""
    return TestClient(app)


@pytest_asyncio.fixture
async def async_client(test_db) -> AsyncGenerator[AsyncClient, None]:
    """Create an async HTTP client for testing async endpoints."""
    # Override get_db dependency
    async def get_test_db():
        yield test_db

    app.dependency_overrides[get_db] = get_test_db

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
def auth_token() -> str:
    """Generate a valid JWT token for authenticated requests."""
    return create_access_token(
        data={"sub": "test@example.com"},
        expires_delta=None  # No expiration for tests
    )


@pytest.fixture
def auth_headers(auth_token: str) -> dict:
    """Generate authorization headers with valid JWT token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def admin_token() -> str:
    """Generate a JWT token for admin user."""
    return create_access_token(
        data={"sub": "admin@example.com", "is_admin": True},
        expires_delta=None
    )


@pytest.fixture
def admin_headers(admin_token: str) -> dict:
    """Generate authorization headers with admin JWT token."""
    return {"Authorization": f"Bearer {admin_token}"}
