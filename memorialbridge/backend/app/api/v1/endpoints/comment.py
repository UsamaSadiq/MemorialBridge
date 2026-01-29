"""Comment endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Form, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.schemas.comment import CommentCreate, CommentResponse, CommentsListResponse
from app.services.comment import CommentService
from app.db.session import get_db
from app.api.dependencies import get_current_user, get_current_admin
from app.models import User

router = APIRouter(prefix="/memorials", tags=["comments"])


@router.get("/{memorial_id}/comments", response_model=CommentsListResponse)
async def get_comments(
    memorial_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a memorial. Hidden comments are excluded for all users."""
    service = CommentService(db)
    comments, total = await service.get_memorial_comments(memorial_id, page, limit)
    
    items = [
        CommentResponse(
            id=c.id,
            user_id=c.user_id,
            user_email=c.user.email.split('@')[0] + '***' if c.user else 'Anonymous',
            content=c.content,
            image_url=c.image_url,
            is_hidden=getattr(c, "is_hidden", False),
            created_at=c.created_at.isoformat()
        )
        for c in comments
    ]
    
    return CommentsListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit
    )


@router.post("/{memorial_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    memorial_id: str,
    content: Optional[str] = Form(None),
    body: Optional[dict] = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a comment. Accepts form field 'content' or JSON body with 'content' or 'text'."""
    text = content
    if text is None and body:
        text = body.get("content") or body.get("text")
    if not text or not str(text).strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment content cannot be empty"
        )
    text = str(text).strip()
    
    service = CommentService(db)
    comment = await service.create_comment(memorial_id, current_user.id, text)
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found"
        )
    
    await db.commit()
    
    return CommentResponse(
        id=comment.id,
        user_id=comment.user_id,
        user_email=current_user.email.split('@')[0] + '***',
        content=comment.content,
        image_url=comment.image_url,
        is_hidden=getattr(comment, "is_hidden", False),
        created_at=comment.created_at.isoformat()
    )


@router.patch("/{memorial_id}/comments/{comment_id}/hide")
async def hide_comment(
    memorial_id: str,
    comment_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Hide a comment on the tribute wall (admin only)."""
    service = CommentService(db)
    success = await service.hide_comment(comment_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    await db.commit()
    return {"message": "Comment hidden"}


@router.delete("/{memorial_id}/comments/{comment_id}")
async def delete_comment(
    memorial_id: str,
    comment_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a comment."""
    service = CommentService(db)
    
    # Get comment to check ownership
    comment_repo = service.comment_repo
    comment = await comment_repo.get(comment_id)
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check if current user is the creator
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments"
        )
    
    success = await service.delete_comment(comment_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    await db.commit()
    
    return {"message": "Comment deleted successfully"}
