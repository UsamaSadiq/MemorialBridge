"""Auth endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    ProfileUpdate,
    ChangePassword,
)
from app.services import AuthService
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_to_response(user: User) -> UserResponse:
    """Build UserResponse from User model."""
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        is_pro=user.is_pro,
        is_admin=user.is_admin,
        created_at=user.created_at.isoformat(),
        updated_at=user.updated_at.isoformat() if user.updated_at else None,
        last_login=user.last_login.isoformat() if user.last_login else None,
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    auth_service = AuthService(db)
    # If password_confirm not provided by client, default to password
    password_confirm = user_data.password_confirm if user_data.password_confirm is not None else user_data.password

    success, message, user = await auth_service.register_user(
        user_data.email,
        user_data.password,
        password_confirm,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    await db.commit()

    return _user_to_response(user)


@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """User login - authenticate with email and password."""
    auth_service = AuthService(db)
    
    success, message, user, token = await auth_service.login_user(
        login_data.email,
        login_data.password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message
        )
    
    await db.commit()

    return TokenResponse(
        access_token=token,
        user=_user_to_response(user),
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """User logout - client-side token removal."""
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info - requires authentication."""
    return _user_to_response(current_user)


@router.put("/me", response_model=UserResponse)
async def update_me(
    body: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user profile (email, first_name, last_name)."""
    auth_service = AuthService(db)
    try:
        user = await auth_service.update_profile(
            current_user,
            email=body.email,
            first_name=body.first_name,
            last_name=body.last_name,
        )
        return _user_to_response(user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/change-password")
async def change_password(
    body: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change current user password."""
    auth_service = AuthService(db)
    try:
        await auth_service.change_password(
            current_user,
            body.current_password,
            body.new_password,
        )
        return {"message": "Password changed successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
