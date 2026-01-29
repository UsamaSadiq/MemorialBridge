"""
Integration tests for comment endpoints.
Tests comment creation, listing, deletion, and moderation.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))


class TestCommentEndpoints:
    """Test comment API endpoints."""

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

    @pytest.fixture
    def memorial_with_comments(self, client, registered_user):
        """Create a memorial for testing comments."""
        response = client.post(
            "/api/v1/memorials",
            headers=registered_user["headers"],
            data={
                "name": "Test Memorial",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Test bio",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        return response.json()["id"]

    def test_create_comment_success(self, client, registered_user, memorial_with_comments):
        """Test successful comment creation."""
        response = client.post(
            f"/api/v1/memorials/{memorial_with_comments}/comments",
            headers=registered_user["headers"],
            data={"content": "Beautiful tribute to a great person."},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["content"] == "Beautiful tribute to a great person."
        assert "user_email" in data  # Email should be masked

    def test_create_comment_without_auth(self, client, memorial_with_comments):
        """Test comment creation without authentication."""
        response = client.post(
            f"/api/v1/memorials/{memorial_with_comments}/comments",
            data={"content": "Some comment"},
        )
        assert response.status_code == 403

    def test_create_comment_empty_content(self, client, registered_user, memorial_with_comments):
        """Test comment creation with empty content."""
        response = client.post(
            f"/api/v1/memorials/{memorial_with_comments}/comments",
            headers=registered_user["headers"],
            data={"content": ""},
        )
        assert response.status_code in [400, 422]  # Either validation error or bad request

    def test_create_comment_nonexistent_memorial(self, client, registered_user):
        """Test comment creation on non-existent memorial."""
        response = client.post(
            "/api/v1/memorials/nonexistent/comments",
            headers=registered_user["headers"],
            data={"content": "Comment on nothing"},
        )
        assert response.status_code == 404

    def test_get_comments_pagination(self, client, registered_user, memorial_with_comments):
        """Test comments list pagination."""
        response = client.get(
            f"/api/v1/memorials/{memorial_with_comments}/comments?page=1&page_size=10"
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data

    def test_delete_comment_by_creator(self, client, registered_user, memorial_with_comments):
        """Test that comment creator can delete their comment."""
        # Create comment
        create_response = client.post(
            f"/api/v1/memorials/{memorial_with_comments}/comments",
            headers=registered_user["headers"],
            data={"content": "To be deleted"},
        )
        comment_id = create_response.json()["id"]

        # Delete comment
        response = client.delete(
            f"/api/v1/memorials/{memorial_with_comments}/comments/{comment_id}",
            headers=registered_user["headers"],
        )
        assert response.status_code == 200

    def test_delete_comment_not_creator(self, client, registered_user, memorial_with_comments):
        """Test that non-creator cannot delete comment."""
        # Create comment
        create_response = client.post(
            f"/api/v1/memorials/{memorial_with_comments}/comments",
            headers=registered_user["headers"],
            data={"content": "Protected comment"},
        )
        comment_id = create_response.json()["id"]

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

        # Try to delete with different user
        response = client.delete(
            f"/api/v1/memorials/{memorial_with_comments}/comments/{comment_id}",
            headers=other_headers,
        )
        assert response.status_code == 403

    def test_delete_comment_without_auth(self, client, registered_user, memorial_with_comments):
        """Test that unauthenticated user cannot delete comment."""
        # Create comment
        create_response = client.post(
            f"/api/v1/memorials/{memorial_with_comments}/comments",
            headers=registered_user["headers"],
            data={"content": "Comment"},
        )
        comment_id = create_response.json()["id"]

        # Try to delete without auth
        response = client.delete(
            f"/api/v1/memorials/{memorial_with_comments}/comments/{comment_id}"
        )
        assert response.status_code == 403

    def test_delete_nonexistent_comment(self, client, registered_user, memorial_with_comments):
        """Test deleting non-existent comment."""
        response = client.delete(
            f"/api/v1/memorials/{memorial_with_comments}/comments/nonexistent",
            headers=registered_user["headers"],
        )
        assert response.status_code == 404
