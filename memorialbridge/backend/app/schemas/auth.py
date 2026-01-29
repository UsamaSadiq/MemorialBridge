"""Authentication schemas."""
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional


class UserRegister(BaseModel):
    """User registration request."""
    # Use plain str for email/password so we can perform custom validation
    # in the service and return appropriate 400 errors for invalid formats
    email: str
    password: str
    password_confirm: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserLogin(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_pro: bool
    is_admin: bool
    created_at: str
    updated_at: Optional[str] = None
    last_login: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    """Profile update request (PUT /auth/me)."""
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class ChangePassword(BaseModel):
    """Change password request. Accepts camelCase from frontend."""
    model_config = ConfigDict(populate_by_name=True)
    current_password: str = Field(..., alias="currentPassword")
    new_password: str = Field(..., alias="newPassword")


class TokenResponse(BaseModel):
    """Token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LogoutResponse(BaseModel):
    """Logout response."""
    message: str = "Logged out successfully"
