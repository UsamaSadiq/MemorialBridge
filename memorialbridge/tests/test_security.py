"""
Unit tests for security utilities.
Tests password hashing, verification, and JWT token operations.
"""
import sys
from pathlib import Path
import pytest
from datetime import timedelta, datetime, timezone

# Add backend directory to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)


class TestPasswordHashing:
    """Test password hashing and verification."""

    def test_hash_password_returns_string(self):
        """Test that hashing returns a non-empty string."""
        password = "TestPass123!"  # Shorter for bcrypt 72-byte limit
        hashed = hash_password(password)
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_password_creates_different_hashes(self):
        """Test that the same password produces different hashes (due to salt)."""
        password = "TestPass123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2

    def test_verify_password_correct(self):
        """Test that correct passwords verify successfully."""
        password = "TestPass123!"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test that incorrect passwords fail verification."""
        password = "TestPass123!"
        wrong_password = "WrongPass456!"
        hashed = hash_password(password)
        assert verify_password(wrong_password, hashed) is False

    def test_verify_password_case_sensitive(self):
        """Test that password verification is case-sensitive."""
        password = "TestPass123!"
        hashed = hash_password(password)
        assert verify_password("testpass123!", hashed) is False

    def test_verify_password_empty_string(self):
        """Test that empty password fails verification."""
        password = "TestPass123!"
        hashed = hash_password(password)
        assert verify_password("", hashed) is False


class TestJWTTokens:
    """Test JWT token creation and decoding."""

    def test_create_access_token(self):
        """Test that valid token is created."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data=data)
        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_token_valid(self):
        """Test that valid token decodes correctly."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data=data)
        decoded = decode_token(token)
        assert decoded is not None
        assert decoded["sub"] == "test@example.com"

    def test_decode_token_includes_exp(self):
        """Test that token includes expiration time."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data=data)
        decoded = decode_token(token)
        assert "exp" in decoded

    def test_decode_token_custom_expires_delta(self):
        """Test token with custom expiration delta."""
        data = {"sub": "test@example.com"}
        expires_delta = timedelta(hours=2)
        token = create_access_token(data=data, expires_delta=expires_delta)
        decoded = decode_token(token)
        assert decoded is not None
        # Verify the token has future expiration
        exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
        now = datetime.now(tz=timezone.utc)
        assert exp_time > now

    def test_decode_invalid_token_returns_none(self):
        """Test that invalid token returns None."""
        invalid_token = "invalid.token.here"
        result = decode_token(invalid_token)
        assert result is None

    def test_decode_malformed_token_returns_none(self):
        """Test that malformed token returns None."""
        result = decode_token("not_a_valid_jwt")
        assert result is None

    def test_decode_empty_token_returns_none(self):
        """Test that empty token returns None."""
        result = decode_token("")
        assert result is None

    def test_token_with_multiple_claims(self):
        """Test token with multiple data claims."""
        data = {"sub": "test@example.com", "is_admin": True, "role": "admin"}
        token = create_access_token(data=data)
        decoded = decode_token(token)
        assert decoded["sub"] == "test@example.com"
        assert decoded["is_admin"] is True
        assert decoded["role"] == "admin"

    def test_token_default_expiration(self):
        """Test that default expiration is approximately 7 days."""
        data = {"sub": "test@example.com"}
        token = create_access_token(data=data)
        decoded = decode_token(token)
        
        exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
        now = datetime.now(tz=timezone.utc)
        
        # Calculate difference
        diff_seconds = (exp_time - now).total_seconds()
        # Should be approximately 7 days (604800 seconds)
        # Allow 60 seconds variance
        assert 604740 < diff_seconds < 604860

    def test_token_with_zero_expires_delta(self):
        """Test that token with zero expiration delta is still created."""
        data = {"sub": "test@example.com"}
        expires_delta = timedelta(seconds=0)
        token = create_access_token(data=data, expires_delta=expires_delta)
        decoded = decode_token(token)
        # Token should still be decodable as it has just-now expiration
        assert decoded is not None
