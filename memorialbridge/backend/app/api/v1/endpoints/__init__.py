"""Auth endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services import AuthService
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=dict)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    auth_service = AuthService(db)
    
    success, message, user = await auth_service.register_user(
        user_data.email,
        user_data.password,
        user_data.password_confirm
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    await db.commit()
    
    return {
        "message": message,
        "user_id": user.id
    }


@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """User login."""
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
        user=UserResponse(
            id=user.id,
            email=user.email,
            is_pro=user.is_pro,
            is_admin=user.is_admin,
            created_at=user.created_at.isoformat()
        )
    )


@router.post("/logout")
async def logout():
    """User logout (client-side token removal)."""
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user = Depends(None),  # Will be added with dependency
    db: AsyncSession = Depends(get_db)
):
    """Get current user info."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        is_pro=current_user.is_pro,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at.isoformat()
    )
