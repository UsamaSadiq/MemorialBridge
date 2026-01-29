"""
Integration tests for subscription endpoints.
Tests pro plan status, upgrades, and downgrades.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))


class TestSubscriptionEndpoints:
    """Test subscription and pro plan endpoints."""

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

    def test_get_subscription_status_requires_auth(self, client):
        """Test that subscription status requires authentication."""
        response = client.get("/api/v1/subscription/status")
        assert response.status_code == 403

    def test_get_subscription_status_free_user(self, client, registered_user):
        """Test subscription status for free user."""
        response = client.get(
            "/api/v1/subscription/status",
            headers=registered_user["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert "is_pro" in data
        assert data["is_pro"] is False
        assert "pro_features" in data

    def test_subscription_status_has_features(self, client, registered_user):
        """Test that subscription status includes feature flags."""
        response = client.get(
            "/api/v1/subscription/status",
            headers=registered_user["headers"],
        )
        data = response.json()
        features = data.get("pro_features", {})
        
        # Free tier features
        assert "memorial_limit" in features
        assert "storage_limit_mb" in features
        assert "image_comments_per_memorial" in features

    def test_upgrade_subscription_requires_auth(self, client):
        """Test that upgrade requires authentication."""
        response = client.post("/api/v1/subscription/upgrade")
        assert response.status_code == 403

    def test_upgrade_subscription_success(self, client, registered_user):
        """Test successful subscription upgrade (mocked)."""
        response = client.post(
            "/api/v1/subscription/upgrade",
            headers=registered_user["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "is_pro" in data

    def test_upgrade_already_pro_user(self, client, registered_user):
        """Test upgrading already pro user."""
        # First upgrade
        client.post(
            "/api/v1/subscription/upgrade",
            headers=registered_user["headers"],
        )

        # Try to upgrade again
        response = client.post(
            "/api/v1/subscription/upgrade",
            headers=registered_user["headers"],
        )
        # Should handle gracefully
        assert response.status_code in [200, 400, 409]

    def test_downgrade_subscription_requires_auth(self, client):
        """Test that downgrade requires authentication."""
        response = client.post("/api/v1/subscription/downgrade")
        assert response.status_code == 403

    def test_downgrade_subscription_success(self, client, registered_user):
        """Test successful subscription downgrade (mocked)."""
        response = client.post(
            "/api/v1/subscription/downgrade",
            headers=registered_user["headers"],
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "is_pro" in data

    def test_downgrade_free_user(self, client, registered_user):
        """Test downgrading already free user."""
        response = client.post(
            "/api/v1/subscription/downgrade",
            headers=registered_user["headers"],
        )
        # Should handle gracefully
        assert response.status_code in [200, 400, 409]

    def test_pro_features_availability(self, client, registered_user):
        """Test that pro features are only available to pro users."""
        # Get status for free user
        response = client.get(
            "/api/v1/subscription/status",
            headers=registered_user["headers"],
        )
        data = response.json()
        free_features = data.get("pro_features", {})

        # Upgrade
        client.post(
            "/api/v1/subscription/upgrade",
            headers=registered_user["headers"],
        )

        # Get status for pro user
        response = client.get(
            "/api/v1/subscription/status",
            headers=registered_user["headers"],
        )
        data = response.json()
        pro_features = data.get("pro_features", {})

        # Pro features should be more generous
        assert pro_features.get("memorial_limit", 0) >= free_features.get("memorial_limit", 0)
        assert pro_features.get("storage_limit_mb", 0) >= free_features.get("storage_limit_mb", 0)

    def test_subscription_status_response_structure(self, client, registered_user):
        """Test that subscription status has proper response structure."""
        response = client.get(
            "/api/v1/subscription/status",
            headers=registered_user["headers"],
        )
        data = response.json()
        
        assert "is_pro" in data
        assert isinstance(data["is_pro"], bool)
        assert "pro_features" in data
        assert isinstance(data["pro_features"], dict)
