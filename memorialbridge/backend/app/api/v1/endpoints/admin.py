"""Admin moderation endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Form, Body
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.db.session import get_db
from app.api.dependencies import get_current_admin
from app.models import User
from app.services.memorial import MemorialService
from app.services.comment import CommentService
from app.services.charity import CharityService
from app.schemas.memorial import MemorialsListResponse, MemorialCardResponse
from app.schemas.comment import CommentsListResponse, CommentResponse
from app.schemas.charity import CharityCreate, CharityResponse, CharitiesListResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/memorials/pending", response_model=MemorialsListResponse)
async def get_pending_memorials(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get pending memorials for moderation (admin only)."""
    service = MemorialService(db)
    memorials, total = await service.get_pending_memorials(page, limit)
    
    items = [
        MemorialCardResponse(
            id=m.id,
            full_name=m.full_name,
            birth_date=m.birth_date,
            death_date=m.death_date,
            privacy=m.privacy.value,
            status=(m.status.value if hasattr(m.status, "value") else m.status),
            user_id=getattr(m, "user_id", None),
            images=[
                {"id": img.id, "url": img.image_url, "order": img.image_order}
                for img in m.images
            ],
            created_at=m.created_at.isoformat()
        )
        for m in memorials
    ]
    
    pages = (total + limit - 1) // limit
    
    return MemorialsListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.post("/memorials/{memorial_id}/approve")
async def approve_memorial(
    memorial_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Approve a pending memorial (admin only). When approved, the memorial becomes available according to the creator's privacy setting: public (visible to all), link-only (only via direct link), or specific group (future)."""
    service = MemorialService(db)
    success = await service.approve_memorial(memorial_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found"
        )
    
    await db.commit()
    
    return {"message": "Memorial approved successfully"}


@router.post("/memorials/{memorial_id}/reject")
async def reject_memorial(
    memorial_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Reject a pending memorial (admin only)."""
    service = MemorialService(db)
    success = await service.reject_memorial(memorial_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found"
        )
    
    await db.commit()
    
    return {"message": "Memorial rejected"}


class SetFeaturedBody(BaseModel):
    is_featured: bool


@router.patch("/memorials/{memorial_id}/featured")
async def set_memorial_featured(
    memorial_id: str,
    body: SetFeaturedBody = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """Mark or unmark a memorial as featured (admin only). Featured memorials appear on the home page."""
    service = MemorialService(db)
    success = await service.set_memorial_featured(memorial_id, body.is_featured)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found",
        )
    await db.commit()
    return {"message": "Memorial featured updated", "is_featured": body.is_featured}


@router.get("/comments/flagged", response_model=CommentsListResponse)
async def get_flagged_comments(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get flagged comments for moderation (admin only)."""
    service = CommentService(db)
    comments, total = await service.get_flagged_comments(page, limit)
    
    items = [
        CommentResponse(
            id=c.id,
            user_id=c.user_id,
            user_email=c.user.email.split('@')[0] + '***' if c.user else 'Anonymous',
            content=c.content,
            image_url=c.image_url,
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


@router.post("/comments/{comment_id}/flag")
async def flag_comment(
    comment_id: str,
    reason: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Flag a comment as inappropriate (admin only)."""
    service = CommentService(db)
    success = await service.flag_comment(comment_id, reason)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    await db.commit()
    
    return {"message": "Comment flagged successfully"}


@router.post("/comments/{comment_id}/unflag")
async def unflag_comment(
    comment_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Remove flag from a comment (admin only)."""
    from app.repositories.comment import CommentRepository
    repo = CommentRepository(db)
    comment = await repo.get(comment_id)
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    comment.is_flagged = False
    comment.flagged_reason = None
    await db.flush()
    await db.commit()
    
    return {"message": "Comment unflagged"}


# --- Admin charity management ---

@router.get("/charities", response_model=CharitiesListResponse)
async def admin_list_charities(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """List all charities including inactive (admin only)."""
    service = CharityService(db)
    charities, total = await service.get_all_charities(page, limit)
    items = [
        CharityResponse(
            id=c.id,
            name=c.name,
            description=c.description,
            url=c.url,
            is_active=c.is_active,
            created_at=c.created_at.isoformat()
        )
        for c in charities
    ]
    return CharitiesListResponse(items=items, total=total, page=page, page_size=limit)


@router.post("/charities", response_model=CharityResponse)
async def admin_create_charity(
    body: CharityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new charity (admin only)."""
    service = CharityService(db)
    charity = await service.create_charity(
        name=body.name,
        description=body.description,
        url=body.url
    )
    await db.commit()
    return CharityResponse(
        id=charity.id,
        name=charity.name,
        description=charity.description,
        url=charity.url,
        is_active=charity.is_active,
        created_at=charity.created_at.isoformat()
    )
