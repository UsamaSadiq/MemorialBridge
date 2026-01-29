"""Comment repository."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from app.models import Comment
from app.repositories import BaseRepository
from typing import List


class CommentRepository(BaseRepository[Comment]):
    """Comment repository with custom queries."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(db, Comment)
    
    async def get_by_memorial(
        self,
        memorial_id: str,
        skip: int = 0,
        limit: int = 50,
        include_hidden: bool = False
    ) -> tuple[List[Comment], int]:
        """Get comments for a memorial with pagination. Excludes hidden unless include_hidden."""
        conditions = [self.model.memorial_id == memorial_id]
        if not include_hidden:
            conditions.append(self.model.is_hidden == False)  # noqa: E712
        query = select(self.model).where(*conditions).order_by(self.model.created_at.asc())
        count_query = select(sa_func.count()).select_from(self.model).where(*conditions)
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all(), total
    
    async def get_flagged_comments(
        self,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Comment], int]:
        """Get flagged comments for moderation."""
        query = select(self.model).where(
            self.model.is_flagged == True
        ).order_by(self.model.created_at.asc())
        
        total = await self.count(is_flagged=True)
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all(), total
