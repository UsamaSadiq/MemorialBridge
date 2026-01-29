"""Charity schemas."""
from pydantic import BaseModel
from typing import Optional, List


class CharityCreate(BaseModel):
    """Create charity request."""
    name: str
    description: Optional[str] = None
    url: str


class CharityUpdate(BaseModel):
    """Update charity request."""
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    is_active: Optional[bool] = None


class CharityResponse(BaseModel):
    """Charity response."""
    id: str
    name: str
    description: Optional[str] = None
    url: str
    is_active: bool
    created_at: str
    
    class Config:
        from_attributes = True


class CharitiesListResponse(BaseModel):
    """List of charities."""
    items: List[CharityResponse]
    total: int
    page: int
    page_size: int
