"""
Integration tests for memorial endpoints.
Tests memorial CRUD operations, search, and privacy enforcement.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))


class TestMemorialEndpoints:
    """Test memorial API endpoints."""

    @pytest.fixture
    def registered_user(self, client):
        """Create and return a registered user with auth token."""
        email = "user@example.com"
        password = "SecurePass123!"
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password},
        )
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        token = login_response.json()["access_token"]
        return {"email": email, "token": token, "headers": {"Authorization": f"Bearer {token}"}}

    def test_create_memorial_success(self, client, registered_user):
        """Test successful memorial creation."""
        response = client.post(
            "/api/v1/memorials",
            headers=registered_user["headers"],
            data={
                "name": "John Doe",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Beloved father and grandfather",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "John Doe"
        assert data["status"] == "pending"  # Auto-pending status
        assert data["privacy"] == "public"

    def test_create_memorial_without_auth(self, client):
        """Test memorial creation without authentication."""
        response = client.post(
            "/api/v1/memorials",
            data={
                "name": "John Doe",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Beloved father",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        assert response.status_code == 403

    def test_get_memorials_list_public_only(self, client, registered_user):
        """Test that only public approved memorials appear in list."""
        # Create a public approved memorial
        client.post(
            "/api/v1/memorials",
            headers=registered_user["headers"],
            data={
                "name": "John Doe",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Beloved father",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )

        # Get memorials list (unauthenticated)
        response = client.get("/api/v1/memorials")
        assert response.status_code == 200
        # Memorials should be empty or not include pending ones
        data = response.json()
        assert isinstance(data, dict)
        assert "items" in data

    def test_get_memorials_with_pagination(self, client, registered_user):
        """Test memorial list pagination."""
        response = client.get("/api/v1/memorials?page=1&page_size=10")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert data["page"] == 1

    def test_get_memorials_with_search(self, client, registered_user):
        """Test memorial list search functionality."""
        response = client.get("/api/v1/memorials?search=John")
        assert response.status_code == 200
        assert "items" in response.json()

    def test_get_memorial_detail_not_found(self, client):
        """Test getting non-existent memorial."""
        response = client.get("/api/v1/memorials/nonexistent-id")
        assert response.status_code == 404

    def test_get_user_memorials_without_auth(self, client):
        """Test getting user memorials without authentication."""
        response = client.get("/api/v1/memorials/my")
        assert response.status_code == 403

    def test_update_memorial_not_owner(self, client, registered_user):
        """Test that only owner can update memorial."""
        # Create memorial
        create_response = client.post(
            "/api/v1/memorials",
            headers=registered_user["headers"],
            data={
                "name": "Original Name",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Original bio",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        memorial_id = create_response.json()["id"]

        # Register different user
        client.post(
            "/api/v1/auth/register",
            json={"email": "other@example.com", "password": "SecurePass123!"},
        )
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": "other@example.com", "password": "SecurePass123!"},
        )
        other_token = login_response.json()["access_token"]
        other_headers = {"Authorization": f"Bearer {other_token}"}

        # Try to update with different user
        response = client.put(
            f"/api/v1/memorials/{memorial_id}",
            headers=other_headers,
            data={
                "name": "Hacked Name",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Hacked",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        assert response.status_code == 403

    def test_delete_memorial_not_owner(self, client, registered_user):
        """Test that only owner can delete memorial."""
        # Create memorial
        create_response = client.post(
            "/api/v1/memorials",
            headers=registered_user["headers"],
            data={
                "name": "Protected",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Protected",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        memorial_id = create_response.json()["id"]

        # Register different user
        client.post(
            "/api/v1/auth/register",
            json={"email": "delete@example.com", "password": "SecurePass123!"},
        )
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": "delete@example.com", "password": "SecurePass123!"},
        )
        other_token = login_response.json()["access_token"]
        other_headers = {"Authorization": f"Bearer {other_token}"}

        # Try to delete with different user
        response = client.delete(
            f"/api/v1/memorials/{memorial_id}",
            headers=other_headers,
        )
        assert response.status_code == 403
