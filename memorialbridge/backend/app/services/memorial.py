"""Memorial service."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Memorial, MemorialImage, Charity, MemorialStatus
from app.repositories.memorial import MemorialRepository
from app.repositories.charity import CharityRepository
from app.db.session import AsyncSessionLocal
from typing import List, Tuple, Optional
from datetime import date


class MemorialService:
    """Memorial business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.memorial_repo = MemorialRepository(db)
        self.charity_repo = CharityRepository(db)
    
    async def create_memorial(
        self,
        user_id: str,
        full_name: str,
        birth_date: Optional[date],
        death_date: Optional[date],
        story: Optional[str],
        privacy: str,
        charity_ids: List[str] = None
    ) -> Memorial:
        """Create a new memorial."""
        memorial = await self.memorial_repo.create({
            "user_id": user_id,
            "full_name": full_name,
            "birth_date": birth_date,
            "death_date": death_date,
            "story": story,
            "privacy": privacy,
            "status": MemorialStatus.PENDING
        })
        
        # Add charities if provided
        if charity_ids:
            for charity_id in charity_ids:
                charity = await self.charity_repo.get(charity_id)
                if charity:
                    memorial.charities.append(charity)
        
        await self.db.flush()
        return memorial
    
    async def add_memorial_image(
        self,
        memorial_id: str,
        image_url: str,
        order: int
    ) -> MemorialImage:
        """Add image to memorial."""
        image = MemorialImage(
            memorial_id=memorial_id,
            image_url=image_url,
            image_order=order
        )
        self.db.add(image)
        await self.db.flush()
        return image
    
    async def update_memorial(
        self,
        memorial_id: str,
        full_name: Optional[str] = None,
        birth_date: Optional[date] = None,
        death_date: Optional[date] = None,
        story: Optional[str] = None,
        privacy: Optional[str] = None,
        charity_ids: Optional[List[str]] = None
    ) -> Optional[Memorial]:
        """Update memorial."""
        memorial = await self.memorial_repo.get(memorial_id)
        if not memorial:
            return None
        
        update_data = {}
        if full_name is not None:
            update_data["full_name"] = full_name
        if birth_date is not None:
            update_data["birth_date"] = birth_date
        if death_date is not None:
            update_data["death_date"] = death_date
        if story is not None:
            update_data["story"] = story
        if privacy is not None:
            update_data["privacy"] = privacy
        
        # Reset status to pending if content changed
        if update_data:
            update_data["status"] = MemorialStatus.PENDING
        
        memorial = await self.memorial_repo.update(memorial, update_data)
        
        # Update charities if provided
        if charity_ids is not None:
            memorial.charities = []
            for charity_id in charity_ids:
                charity = await self.charity_repo.get(charity_id)
                if charity:
                    memorial.charities.append(charity)
        
        await self.db.flush()
        return memorial
    
    async def delete_memorial(self, memorial_id: str) -> bool:
        """Delete memorial and cascade delete images and comments."""
        memorial = await self.memorial_repo.get(memorial_id)
        if not memorial:
            return False
        
        # Delete images from filesystem
        for image in memorial.images:
            try:
                import os
                if os.path.exists(image.image_url):
                    os.remove(image.image_url)
            except:
                pass
        
        await self.memorial_repo.delete(memorial)
        await self.db.flush()
        return True
    
    async def get_public_memorials(
        self,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None
    ) -> Tuple[List[Memorial], int]:
        """Get public memorials with pagination."""
        skip = (page - 1) * limit
        return await self.memorial_repo.get_public_memorials(skip, limit, search)

    async def get_featured_memorials(
        self,
        page: int = 1,
        limit: int = 20,
    ) -> Tuple[List[Memorial], int]:
        """Get approved public memorials marked as featured (for home page). No auth required."""
        skip = (page - 1) * limit
        return await self.memorial_repo.get_featured_memorials(skip, limit)

    async def get_memorials_list(
        self,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        status_filter: str = "approved",
        user_id: Optional[str] = None,
        is_admin: bool = False,
    ) -> Tuple[List[Memorial], int]:
        """Get memorials filterable by status (all, approved, pending). When is_admin=True, returns all memorials."""
        skip = (page - 1) * limit
        return await self.memorial_repo.get_memorials_list(
            skip, limit, search, status_filter, user_id, is_admin
        )
    
    async def get_user_memorials(self, user_id: str) -> List[Memorial]:
        """Get all memorials by user."""
        return await self.memorial_repo.get_by_user(user_id)
    
    async def get_memorial(self, memorial_id: str) -> Optional[Memorial]:
        """Get memorial by ID."""
        return await self.memorial_repo.get(memorial_id)
    
    async def approve_memorial(self, memorial_id: str, approved_by_id: str) -> bool:
        """Approve a memorial (admin only)."""
        memorial = await self.memorial_repo.get(memorial_id)
        if not memorial:
            return False
        
        memorial.status = MemorialStatus.APPROVED
        memorial.approved_by = approved_by_id
        memorial.approved_at = __import__('datetime').datetime.now(__import__('datetime').timezone.utc)
        
        await self.db.flush()
        return True
    
    async def reject_memorial(self, memorial_id: str) -> bool:
        """Reject a memorial (admin only)."""
        memorial = await self.memorial_repo.get(memorial_id)
        if not memorial:
            return False
        
        memorial.status = MemorialStatus.REJECTED
        await self.db.flush()
        return True

    async def set_memorial_featured(self, memorial_id: str, is_featured: bool) -> bool:
        """Set or unset featured flag on a memorial (admin only)."""
        memorial = await self.memorial_repo.get(memorial_id)
        if not memorial:
            return False
        memorial.is_featured = is_featured
        await self.db.flush()
        return True
    
    async def get_pending_memorials(
        self,
        page: int = 1,
        limit: int = 50
    ) -> Tuple[List[Memorial], int]:
        """Get pending memorials for moderation."""
        skip = (page - 1) * limit
        return await self.memorial_repo.get_pending_memorials(skip, limit)
