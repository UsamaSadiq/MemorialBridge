"""Comment schemas."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CommentCreate(BaseModel):
    """Create comment request."""
    content: str = Field(..., min_length=1, max_length=5000)


class CommentResponse(BaseModel):
    """Comment response."""
    id: str
    user_id: str
    user_email: str
    content: str
    image_url: Optional[str] = None
    is_hidden: bool = False
    created_at: str

    model_config = {"from_attributes": True}


class CommentsListResponse(BaseModel):
    """List of comments with pagination."""
    items: List[CommentResponse]
    total: int
    page: int
    limit: int
