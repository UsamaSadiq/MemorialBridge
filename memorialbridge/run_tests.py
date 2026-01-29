#!/usr/bin/env python3
"""
Simple test runner for Memorial Bridge backend tests.
Avoids alembic configuration issues by running tests directly.
"""
import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Set test database URL
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

# Import and run pytest
import pytest

if __name__ == "__main__":
    sys.exit(pytest.main(["tests/", "-v", "--tb=short"]))