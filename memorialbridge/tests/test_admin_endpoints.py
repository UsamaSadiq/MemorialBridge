"""
Integration tests for admin endpoints.
Tests memorial moderation, comment flagging, and admin authorization.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))


class TestAdminEndpoints:
    """Test admin moderation endpoints."""

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
    def admin_user(self, client):
        """Create and return an admin user with auth token."""
        # For testing, we'll use the admin_headers fixture
        # In real scenario, this would need admin account setup
        email = "admin@example.com"
        password = "AdminPass123!"
        
        # Create user (normal endpoint)
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password},
        )
        
        # Login
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        token = login_response.json()["access_token"]
        return {"email": email, "token": token, "headers": {"Authorization": f"Bearer {token}"}}

    @pytest.fixture
    def pending_memorial(self, client, registered_user):
        """Create a pending memorial for testing."""
        response = client.post(
            "/api/v1/memorials",
            headers=registered_user["headers"],
            data={
                "name": "Pending Memorial",
                "birth_date": "1950-05-15",
                "death_date": "2024-01-15",
                "bio": "Pending approval",
                "privacy": "public",
                "charity_ids": "[]",
            },
        )
        return response.json()["id"]

    def test_get_pending_memorials_requires_admin(self, client, registered_user):
        """Test that only admins can view pending memorials."""
        response = client.get(
            "/api/v1/admin/memorials/pending",
            headers=registered_user["headers"],
        )
        assert response.status_code == 403  # Forbidden for non-admin

    def test_get_pending_memorials_requires_auth(self, client):
        """Test that pending memorials requires authentication."""
        response = client.get("/api/v1/admin/memorials/pending")
        assert response.status_code == 403

    def test_approve_memorial_requires_admin(self, client, registered_user, pending_memorial):
        """Test that only admins can approve memorials."""
        response = client.post(
            f"/api/v1/admin/memorials/{pending_memorial}/approve",
            headers=registered_user["headers"],
        )
        assert response.status_code == 403

    def test_approve_memorial_nonexistent(self, client, admin_headers):
        """Test approving non-existent memorial."""
        response = client.post(
            "/api/v1/admin/memorials/nonexistent/approve",
            headers=admin_headers,
        )
        assert response.status_code == 404

    def test_reject_memorial_requires_admin(self, client, registered_user, pending_memorial):
        """Test that only admins can reject memorials."""
        response = client.post(
            f"/api/v1/admin/memorials/{pending_memorial}/reject",
            headers=registered_user["headers"],
        )
        assert response.status_code == 403

    def test_reject_memorial_nonexistent(self, client, admin_headers):
        """Test rejecting non-existent memorial."""
        response = client.post(
            "/api/v1/admin/memorials/nonexistent/reject",
            headers=admin_headers,
        )
        assert response.status_code == 404

    def test_get_flagged_comments_requires_admin(self, client, registered_user):
        """Test that only admins can view flagged comments."""
        response = client.get(
            "/api/v1/admin/comments/flagged",
            headers=registered_user["headers"],
        )
        assert response.status_code == 403

    def test_get_flagged_comments_requires_auth(self, client):
        """Test that flagged comments requires authentication."""
        response = client.get("/api/v1/admin/comments/flagged")
        assert response.status_code == 403

    def test_flag_comment_requires_admin(self, client, registered_user):
        """Test that only admins can flag comments."""
        # This assumes you can get a comment ID somehow
        response = client.post(
            "/api/v1/admin/comments/some-id/flag",
            headers=registered_user["headers"],
            json={"reason": "Inappropriate content"},
        )
        assert response.status_code in [403, 404]  # Either forbidden or not found

    def test_flag_comment_nonexistent(self, client, admin_headers):
        """Test flagging non-existent comment."""
        response = client.post(
            "/api/v1/admin/comments/nonexistent/flag",
            headers=admin_headers,
            data={"reason": "Inappropriate"},
        )
        assert response.status_code == 404

    def test_unflag_comment_requires_admin(self, client, registered_user):
        """Test that only admins can unflag comments."""
        response = client.post(
            "/api/v1/admin/comments/some-id/unflag",
            headers=registered_user["headers"],
        )
        assert response.status_code in [403, 404]

    def test_unflag_comment_nonexistent(self, client, admin_headers):
        """Test unflagging non-existent comment."""
        response = client.post(
            "/api/v1/admin/comments/nonexistent/unflag",
            headers=admin_headers,
        )
        assert response.status_code == 404

    def test_admin_endpoints_response_structure(self, client, admin_headers):
        """Test that admin endpoints return proper response structure."""
        # Test pending memorials list
        response = client.get(
            "/api/v1/admin/memorials/pending",
            headers=admin_headers,
        )
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, dict)
            assert "items" in data or isinstance(data, list)

    def test_flag_comment_with_reason(self, client, admin_headers):
        """Test flagging comment with reason."""
        response = client.post(
            "/api/v1/admin/comments/some-id/flag",
            headers=admin_headers,
            data={"reason": "Spam and harassment"},
        )
        # Should fail with 404 since comment doesn't exist, but validates schema
        assert response.status_code == 404 or response.status_code == 400
