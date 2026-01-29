"""Memorial schemas."""
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import date


class MemorialImageResponse(BaseModel):
    """Memorial image response."""
    id: str
    url: str
    order: int
    
    class Config:
        from_attributes = True


class CharityResponse(BaseModel):
    """Charity response."""
    id: str
    name: str
    description: Optional[str] = None
    url: str
    
    class Config:
        from_attributes = True


class MemorialCreate(BaseModel):
    """Create memorial request."""
    full_name: str = Field(..., alias="name", min_length=1, max_length=255)
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    story: Optional[str] = Field(None, alias="bio", max_length=10000)
    privacy: str = Field(default="public", pattern="^(public|link-only)$")
    charity_ids: Optional[List[str]] = []

    class Config:
        populate_by_name = True


class MemorialUpdate(BaseModel):
    """Update memorial request."""
    full_name: Optional[str] = Field(None, alias="name")
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    story: Optional[str] = Field(None, alias="bio")
    privacy: Optional[str] = None
    charity_ids: Optional[List[str]] = None

    class Config:
        populate_by_name = True


class MemorialResponse(BaseModel):
    """Memorial response."""
    id: str
    full_name: str = Field(..., alias="name")
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    story: Optional[str] = Field(None, alias="bio")
    privacy: str
    status: str
    user_id: Optional[str] = None  # For frontend Edit/Delete (owner)
    is_featured: bool = False  # Admin can feature for home page
    images: List[MemorialImageResponse] = []
    charities: List[CharityResponse] = []
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class MemorialDetailResponse(MemorialResponse):
    """Memorial detail response with full data."""
    pass


class MemorialCardResponse(BaseModel):
    """Memorial card response for gallery."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    full_name: str = Field(..., alias="name")
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    privacy: str
    images: List[MemorialImageResponse] = []
    created_at: str
    status: Optional[str] = None  # Included for "my memorials" so user sees pending/approved
    user_id: Optional[str] = None  # For frontend to show Edit for owner


class MemorialsListResponse(BaseModel):
    """List of memorials with pagination."""
    items: List[MemorialCardResponse]
    total: int
    page: int
    limit: int
    pages: int


class MemorialCreateResponse(BaseModel):
    """Memorial creation response."""
    id: str
    message: str = "Memorial created successfully. It is pending approval."
    status: str = "pending"
    name: str = Field(..., alias="name")
    privacy: str = "pending"
