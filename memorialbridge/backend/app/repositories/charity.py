"""Charity repository."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models import Charity
from app.repositories import BaseRepository
from typing import List


class CharityRepository(BaseRepository[Charity]):
    """Charity repository with custom queries."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(db, Charity)
    
    async def get_active_charities(
        self,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Charity], int]:
        """Get active charities with pagination."""
        query = select(self.model).where(
            self.model.is_active == True
        ).order_by(self.model.created_at.desc())
        
        total = await self.count(is_active=True)
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all(), total

    async def get_all_charities(
        self,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Charity], int]:
        """Get all charities with pagination (admin)."""
        count_q = select(func.count(self.model.id))
        total_result = await self.db.execute(count_q)
        total = total_result.scalar() or 0
        query = (
            select(self.model)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return result.scalars().all(), total

