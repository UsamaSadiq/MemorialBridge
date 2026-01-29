"""Repository base class."""
from sqlalchemy.ext.asyncio import AsyncSession
from typing import TypeVar, Generic, List, Optional, Any
from sqlalchemy import select, func

T = TypeVar('T')


class BaseRepository(Generic[T]):
    """Base repository with common CRUD operations."""
    
    def __init__(self, db: AsyncSession, model: type):
        self.db = db
        self.model = model
    
    async def create(self, obj_in: dict) -> T:
        """Create a new object."""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.flush()
        return db_obj
    
    async def get(self, id: Any) -> Optional[T]:
        """Get object by id."""
        return await self.db.get(self.model, id)
    
    async def get_by(self, **filters) -> Optional[T]:
        """Get object by filter criteria."""
        query = select(self.model)
        for key, value in filters.items():
            query = query.where(getattr(self.model, key) == value)
        result = await self.db.execute(query)
        return result.scalars().first()
    
    async def list(self, skip: int = 0, limit: int = 100) -> List[T]:
        """List objects with pagination."""
        query = select(self.model).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def count(self, **filters) -> int:
        """Count objects matching filters."""
        query = select(func.count(self.model.id))
        for key, value in filters.items():
            query = query.where(getattr(self.model, key) == value)
        result = await self.db.execute(query)
        return result.scalar() or 0
    
    async def update(self, db_obj: T, obj_in: dict) -> T:
        """Update object."""
        for key, value in obj_in.items():
            if hasattr(db_obj, key):
                setattr(db_obj, key, value)
        self.db.add(db_obj)
        await self.db.flush()
        return db_obj
    
    async def delete(self, db_obj: T) -> None:
        """Delete object."""
        await self.db.delete(db_obj)
        await self.db.flush()
