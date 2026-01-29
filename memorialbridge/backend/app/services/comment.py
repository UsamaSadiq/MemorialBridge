"""Comment service."""
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Comment
from app.repositories.comment import CommentRepository
from app.repositories.memorial import MemorialRepository
from typing import List, Tuple, Optional


class CommentService:
    """Comment business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.comment_repo = CommentRepository(db)
        self.memorial_repo = MemorialRepository(db)
    
    async def create_comment(
        self,
        memorial_id: str,
        user_id: str,
        content: str,
        image_url: Optional[str] = None
    ) -> Optional[Comment]:
        """Create a new comment."""
        # Verify memorial exists
        memorial = await self.memorial_repo.get(memorial_id)
        if not memorial:
            return None
        
        comment = await self.comment_repo.create({
            "memorial_id": memorial_id,
            "user_id": user_id,
            "content": content,
            "image_url": image_url,
            "is_flagged": False
        })
        await self.db.flush()
        return comment
    
    async def get_memorial_comments(
        self,
        memorial_id: str,
        page: int = 1,
        limit: int = 50,
        include_hidden: bool = False
    ) -> Tuple[List[Comment], int]:
        """Get comments for a memorial. Excludes hidden unless include_hidden."""
        skip = (page - 1) * limit
        return await self.comment_repo.get_by_memorial(memorial_id, skip, limit, include_hidden)
    
    async def delete_comment(self, comment_id: str) -> bool:
        """Delete a comment."""
        comment = await self.comment_repo.get(comment_id)
        if not comment:
            return False
        
        await self.comment_repo.delete(comment)
        await self.db.flush()
        return True
    
    async def flag_comment(
        self,
        comment_id: str,
        reason: str
    ) -> bool:
        """Flag a comment as inappropriate."""
        comment = await self.comment_repo.get(comment_id)
        if not comment:
            return False
        
        comment.is_flagged = True
        comment.flagged_reason = reason
        await self.db.flush()
        return True
    
    async def get_flagged_comments(
        self,
        page: int = 1,
        limit: int = 50
    ) -> Tuple[List[Comment], int]:
        """Get flagged comments for moderation."""
        skip = (page - 1) * limit
        return await self.comment_repo.get_flagged_comments(skip, limit)

    async def hide_comment(self, comment_id: str) -> bool:
        """Hide a comment (admin only). Returns True if updated."""
        comment = await self.comment_repo.get(comment_id)
        if not comment:
            return False
        comment.is_hidden = True
        await self.db.flush()
        return True
