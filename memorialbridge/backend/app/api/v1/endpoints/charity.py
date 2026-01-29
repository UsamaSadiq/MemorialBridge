"""Charity endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.schemas.charity import CharityCreate, CharityResponse, CharitiesListResponse
from app.services.charity import CharityService
from app.db.session import get_db

router = APIRouter(prefix="/charities", tags=["charities"])


@router.get("", response_model=CharitiesListResponse)
async def list_charities(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    """Get active charities."""
    service = CharityService(db)
    charities, total = await service.get_active_charities(page, limit)
    
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


@router.get("/{charity_id}", response_model=CharityResponse)
async def get_charity(
    charity_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get charity details."""
    service = CharityService(db)
    charity = await service.get_charity(charity_id)
    
    if not charity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charity not found"
        )
    
    return CharityResponse(
        id=charity.id,
        name=charity.name,
        description=charity.description,
        url=charity.url,
        is_active=charity.is_active,
        created_at=charity.created_at.isoformat()
    )
