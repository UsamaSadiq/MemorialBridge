"""Charity service."""
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Charity
from app.repositories.charity import CharityRepository
from typing import List, Tuple, Optional


class CharityService:
    """Charity business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.charity_repo = CharityRepository(db)
    
    async def create_charity(
        self,
        name: str,
        description: Optional[str],
        url: str
    ) -> Charity:
        """Create a new charity."""
        charity = await self.charity_repo.create({
            "name": name,
            "description": description,
            "url": url,
            "is_active": True
        })
        await self.db.flush()
        return charity
    
    async def get_active_charities(
        self,
        page: int = 1,
        limit: int = 100
    ) -> Tuple[List[Charity], int]:
        """Get active charities."""
        skip = (page - 1) * limit
        return await self.charity_repo.get_active_charities(skip, limit)
    
    async def get_charity(self, charity_id: str) -> Optional[Charity]:
        """Get charity by ID."""
        return await self.charity_repo.get(charity_id)

    async def get_all_charities(
        self,
        page: int = 1,
        limit: int = 100
    ) -> Tuple[List[Charity], int]:
        """Get all charities (admin)."""
        skip = (page - 1) * limit
        return await self.charity_repo.get_all_charities(skip, limit)
    
    async def update_charity(
        self,
        charity_id: str,
        name: Optional[str] = None,
        description: Optional[str] = None,
        url: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Optional[Charity]:
        """Update charity."""
        charity = await self.charity_repo.get(charity_id)
        if not charity:
            return None
        
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if description is not None:
            update_data["description"] = description
        if url is not None:
            update_data["url"] = url
        if is_active is not None:
            update_data["is_active"] = is_active
        
        charity = await self.charity_repo.update(charity, update_data)
        await self.db.flush()
        return charity
    
    async def delete_charity(self, charity_id: str) -> bool:
        """Delete charity."""
        charity = await self.charity_repo.get(charity_id)
        if not charity:
            return False
        
        await self.charity_repo.delete(charity)
        await self.db.flush()
        return True
