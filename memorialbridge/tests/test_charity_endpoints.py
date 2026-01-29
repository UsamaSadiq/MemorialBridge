"""
Integration tests for charity endpoints.
Tests charity listing and retrieval.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))


class TestCharityEndpoints:
    """Test charity API endpoints."""

    @pytest.fixture
    def setup_charities(self, client):
        """Setup charities in database for testing."""
        # This assumes charities are seeded or can be created
        # For now, we test with empty state
        return []

    def test_get_charities_list(self, client):
        """Test retrieving list of charities."""
        response = client.get("/api/v1/charities")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data

    def test_get_charities_pagination(self, client):
        """Test charities list with pagination."""
        response = client.get("/api/v1/charities?page=1&page_size=10")
        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 1
        assert isinstance(data["items"], list)

    def test_get_charities_invalid_page(self, client):
        """Test charities with invalid page number."""
        response = client.get("/api/v1/charities?page=0")
        assert response.status_code == 422  # Validation error

    def test_get_charity_by_id(self, client):
        """Test retrieving single charity by ID."""
        # First get list
        list_response = client.get("/api/v1/charities")
        charities = list_response.json()["items"]
        
        if charities:
            charity_id = charities[0]["id"]
            response = client.get(f"/api/v1/charities/{charity_id}")
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == charity_id
            assert "name" in data
            assert "description" in data

    def test_get_charity_nonexistent(self, client):
        """Test retrieving non-existent charity."""
        response = client.get("/api/v1/charities/nonexistent-id")
        assert response.status_code == 404

    def test_charities_only_active(self, client):
        """Test that only active charities are returned."""
        response = client.get("/api/v1/charities")
        assert response.status_code == 200
        data = response.json()
        # All returned charities should be active
        for charity in data["items"]:
            assert charity.get("is_active", True) is True

    def test_charities_response_structure(self, client):
        """Test that charities response has expected structure."""
        response = client.get("/api/v1/charities")
        data = response.json()
        
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        
        if data["items"]:
            charity = data["items"][0]
            assert "id" in charity
            assert "name" in charity
            assert "description" in charity
            assert "url" in charity or "website" in charity
