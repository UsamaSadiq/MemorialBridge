"""Authentication service."""
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from app.models import User
from app.repositories.user import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.core.validators import validate_email, validate_password
from typing import Optional, Tuple


class AuthService:
    """Authentication business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
    
    async def register_user(
        self,
        email: str,
        password: str,
        password_confirm: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
    ) -> Tuple[bool, str, Optional[User]]:
        """
        Register a new user.

        Returns:
            Tuple of (success, message, user)
        """
        # Validate email format
        if not validate_email(email):
            return False, "Invalid email format", None

        # Check if email exists
        if await self.user_repo.email_exists(email):
            return False, "Email already exists", None

        # Validate password match
        if password != password_confirm:
            return False, "Passwords do not match", None

        # Validate password strength
        is_valid, error_msg = validate_password(password)
        if not is_valid:
            return False, error_msg, None

        # Create user
        hashed_password = hash_password(password)
        create_data = {
            "email": email,
            "password_hash": hashed_password,
            "is_pro": False,
            "is_admin": False,
        }
        if first_name is not None:
            create_data["first_name"] = first_name
        if last_name is not None:
            create_data["last_name"] = last_name
        user = await self.user_repo.create(create_data)

        await self.db.commit()

        return True, "User registered successfully", user
    
    async def login_user(self, email: str, password: str) -> Tuple[bool, str, Optional[User], Optional[str]]:
        """
        Authenticate user and return token.
        
        Returns:
            Tuple of (success, message, user, token)
        """
        user = await self.user_repo.get_by_email(email)
        
        if not user:
            return False, "Invalid credentials", None, None
        
        if not verify_password(password, user.password_hash):
            return False, "Invalid credentials", None, None
        
        # Update last login
        user.last_login = __import__('datetime').datetime.now(__import__('datetime').timezone.utc)
        await self.db.commit()
        
        # Create token
        token_data = {
            "sub": user.id,
            "email": user.email,
            "is_pro": user.is_pro,
            "is_admin": user.is_admin
        }
        access_token = create_access_token(token_data)
        
        return True, "Login successful", user, access_token
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return await self.user_repo.get(user_id)

    async def update_profile(
        self, user: User, email: Optional[str] = None, first_name: Optional[str] = None, last_name: Optional[str] = None
    ) -> User:
        """Update user profile. Only provided fields are updated."""
        update_data = {}
        if email is not None:
            if not validate_email(email):
                raise ValueError("Invalid email format")
            existing = await self.user_repo.get_by_email(email)
            if existing is not None and existing.id != user.id:
                raise ValueError("Email already in use")
            update_data["email"] = email
        if first_name is not None:
            update_data["first_name"] = first_name
        if last_name is not None:
            update_data["last_name"] = last_name
        if not update_data:
            return user
        user = await self.user_repo.update(user, update_data)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def change_password(self, user: User, current_password: str, new_password: str) -> None:
        """Change user password. Raises ValueError if current password is wrong or new password invalid."""
        if not verify_password(current_password, user.password_hash):
            raise ValueError("Current password is incorrect")
        is_valid, error_msg = validate_password(new_password)
        if not is_valid:
            raise ValueError(error_msg)
        user.password_hash = hash_password(new_password)
        self.db.add(user)
        await self.db.commit()
