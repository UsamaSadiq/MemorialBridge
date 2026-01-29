"""
Integration tests for authentication endpoints.
Tests user registration, login, logout, and user retrieval.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))


class TestAuthEndpoints:
    """Test authentication API endpoints."""

    def test_register_user_success(self, client):
        """Test successful user registration."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert "id" in data
        assert "password_hash" not in data  # Sensitive info not returned

    def test_register_user_invalid_email(self, client):
        """Test registration with invalid email."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "invalid-email",
                "password": "SecurePass123!",
            },
        )
        assert response.status_code == 400
        assert "email" in response.json()["detail"].lower()

    def test_register_user_weak_password(self, client):
        """Test registration with weak password."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "user@example.com",
                "password": "weak",
            },
        )
        assert response.status_code == 400
        assert "password" in response.json()["detail"].lower()

    def test_register_user_duplicate_email(self, client):
        """Test registration with already registered email."""
        email = "duplicate@example.com"
        password = "SecurePass123!"

        # First registration
        response1 = client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password},
        )
        assert response1.status_code == 201

        # Duplicate registration
        response2 = client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password},
        )
        assert response2.status_code == 400
        assert "already exists" in response2.json()["detail"].lower()

    def test_register_user_missing_fields(self, client):
        """Test registration with missing fields."""
        # Missing password
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "user@example.com"},
        )
        assert response.status_code == 422  # Validation error

        # Missing email
        response = client.post(
            "/api/v1/auth/register",
            json={"password": "SecurePass123!"},
        )
        assert response.status_code == 422

    def test_login_success(self, client):
        """Test successful login."""
        email = "login@example.com"
        password = "SecurePass123!"

        # Register user
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password},
        )

        # Login
        response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        """Test login with wrong password."""
        email = "user@example.com"
        password = "CorrectPass123!"

        # Register user
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password},
        )

        # Login with wrong password
        response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "WrongPass123!"},
        )
        assert response.status_code == 401
        assert "invalid credentials" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login for non-existent user."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "nonexistent@example.com", "password": "AnyPass123!"},
        )
        assert response.status_code == 401

    def test_login_missing_credentials(self, client):
        """Test login with missing credentials."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "user@example.com"},
        )
        assert response.status_code == 422

    def test_logout_success(self, client):
        """Test successful logout."""
        email = "logout@example.com"
        password = "SecurePass123!"
        
        # Register
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
        headers = {"Authorization": f"Bearer {token}"}
        
        response = client.post(
            "/api/v1/auth/logout",
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["message"] == "Logged out successfully"

    def test_logout_without_auth(self, client):
        """Test logout without authentication."""
        response = client.post("/api/v1/auth/logout")
        assert response.status_code == 403  # Forbidden

    def test_get_current_user(self, client):
        """Test getting current authenticated user."""
        email = "current@example.com"
        password = "SecurePass123!"

        # Register
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
        headers = {"Authorization": f"Bearer {token}"}

        # Get current user
        response = client.get(
            "/api/v1/auth/me",
            headers=headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == email
        assert "last_login" in data

    def test_get_current_user_without_auth(self, client):
        """Test getting current user without authentication."""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 403

    def test_get_current_user_with_invalid_token(self, client):
        """Test getting current user with invalid token."""
        headers = {"Authorization": "Bearer invalid.token.here"}
        response = client.get(
            "/api/v1/auth/me",
            headers=headers,
        )
        assert response.status_code == 401

    def test_register_updates_user_fields(self, client):
        """Test that registration properly sets user fields."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "fieldtest@example.com",
                "password": "SecurePass123!",
            },
        )
        data = response.json()
        assert data["is_pro"] is False  # Default pro status
        assert data["is_admin"] is False  # Default admin status
        assert "created_at" in data
