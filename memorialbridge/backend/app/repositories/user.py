"""User repository."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import User
from app.repositories import BaseRepository


class UserRepository(BaseRepository[User]):
    """User repository with custom queries."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)
    
    async def get_by_email(self, email: str) -> User | None:
        """Get user by email."""
        return await self.get_by(email=email)
    
    async def email_exists(self, email: str) -> bool:
        """Check if email already exists."""
        user = await self.get_by_email(email)
        return user is not None
