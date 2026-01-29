"""Memorial repository."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, true
from sqlalchemy.orm import selectinload
from app.models import Memorial, MemorialStatus, MemorialPrivacy
from app.repositories import BaseRepository
from typing import List, Optional


class MemorialRepository(BaseRepository[Memorial]):
    """Memorial repository with custom queries."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(db, Memorial)

    async def get(self, id: str) -> Optional[Memorial]:
        """Get memorial by ID with images and charities eagerly loaded (avoids async lazy-load)."""
        query = (
            select(self.model)
            .options(
                selectinload(self.model.images),
                selectinload(self.model.charities),
            )
            .where(self.model.id == id)
        )
        result = await self.db.execute(query)
        return result.scalars().one_or_none()
    
    async def get_public_memorials(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None
    ) -> tuple[List[Memorial], int]:
        """Get approved public memorials with pagination and search."""
        query = (
            select(self.model)
            .options(selectinload(self.model.images))
            .where(
                and_(
                    self.model.status == MemorialStatus.APPROVED,
                    self.model.privacy == MemorialPrivacy.PUBLIC
                )
            )
        )
        
        if search:
            query = query.where(
                self.model.full_name.ilike(f"%{search}%")
            )
        
        # Get total count (same filters as main query)
        count_stmt = select(func.count(self.model.id)).where(
            and_(
                self.model.status == MemorialStatus.APPROVED,
                self.model.privacy == MemorialPrivacy.PUBLIC
            )
        )
        if search:
            count_stmt = count_stmt.where(
                self.model.full_name.ilike(f"%{search}%")
            )
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0
        
        query = query.order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        memorials = result.scalars().all()
        
        return memorials, total

    async def get_featured_memorials(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[List[Memorial], int]:
        """Get approved public memorials marked as featured (for home page)."""
        where = and_(
            self.model.status == MemorialStatus.APPROVED,
            self.model.privacy == MemorialPrivacy.PUBLIC,
            self.model.is_featured == True,
        )
        count_stmt = select(func.count(self.model.id)).where(where)
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0
        query = (
            select(self.model)
            .options(selectinload(self.model.images))
            .where(where)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        memorials = result.scalars().all()
        return memorials, total
    
    async def get_memorials_list(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        status_filter: str = "approved",
        user_id: Optional[str] = None,
        is_admin: bool = False,
    ) -> tuple[List[Memorial], int]:
        """Get memorials filterable by status. When is_admin=True, returns all memorials (or filtered by status) regardless of ownership."""
        search_filter = self.model.full_name.ilike(f"%{search}%") if search else None

        if is_admin:
            # Admin sees all memorials; status filter still applies
            if status_filter == "approved":
                where = self.model.status == MemorialStatus.APPROVED
            elif status_filter == "pending":
                where = self.model.status == MemorialStatus.PENDING
            else:
                # "all" for admin: no status filter
                where = true()
        elif status_filter == "approved":
            where = and_(
                self.model.status == MemorialStatus.APPROVED,
                self.model.privacy == MemorialPrivacy.PUBLIC,
            )
        elif status_filter == "pending":
            if not user_id:
                return [], 0
            where = and_(
                self.model.user_id == user_id,
                self.model.status == MemorialStatus.PENDING,
            )
        else:
            # all: approved public OR user's own (any status)
            if user_id:
                where = or_(
                    and_(
                        self.model.status == MemorialStatus.APPROVED,
                        self.model.privacy == MemorialPrivacy.PUBLIC,
                    ),
                    self.model.user_id == user_id,
                )
            else:
                where = and_(
                    self.model.status == MemorialStatus.APPROVED,
                    self.model.privacy == MemorialPrivacy.PUBLIC,
                )
        query = (
            select(self.model)
            .options(selectinload(self.model.images))
            .where(where)
        )
        count_stmt = select(func.count(self.model.id)).where(where)
        if search_filter:
            query = query.where(search_filter)
            count_stmt = count_stmt.where(search_filter)
        count_result = await self.db.execute(count_stmt)
        total = count_result.scalar() or 0
        query = query.order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        memorials = result.scalars().all()
        return memorials, total
    
    async def get_by_user(self, user_id: str) -> List[Memorial]:
        """Get all memorials by user with images eagerly loaded (avoids async lazy-load)."""
        query = (
            select(self.model)
            .options(selectinload(self.model.images))
            .where(self.model.user_id == user_id)
            .order_by(self.model.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_pending_memorials(
        self,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Memorial], int]:
        """Get pending memorials for moderation."""
        query = select(self.model).where(
            self.model.status == MemorialStatus.PENDING
        )
        total = await self.count(status=MemorialStatus.PENDING)
        
        query = query.order_by(self.model.created_at.asc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all(), total
