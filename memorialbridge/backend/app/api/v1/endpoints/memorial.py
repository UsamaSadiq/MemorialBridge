"""Memorial endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from app.schemas.memorial import (
    MemorialCreate, MemorialUpdate, MemorialResponse, MemorialsListResponse,
    MemorialCardResponse, MemorialCreateResponse, MemorialImageResponse
)
from app.services.memorial import MemorialService
from app.models import Memorial
from app.db.session import get_db
from app.api.dependencies import get_current_user, get_current_user_optional, get_current_admin
from app.models import User
from app.core.config import get_settings, Settings
from app.utils import save_uploaded_file, is_valid_image_mime_type, is_valid_image_size
from datetime import date

router = APIRouter(prefix="/memorials", tags=["memorials"])


def _image_url_for_response(path: str) -> str:
    """Normalize file path to URL path (forward slashes) for browser."""
    if not path:
        return path
    return path.replace("\\", "/")


@router.get("/my", response_model=MemorialsListResponse)
async def get_user_memorials(
    page: int = Query(1, ge=1),
    limit: int = Query(20, alias="page_size", ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's memorials."""
    service = MemorialService(db)
    memorials = await service.get_user_memorials(current_user.id)
    
    # Apply pagination
    skip = (page - 1) * limit
    total = len(memorials)
    paginated = memorials[skip:skip + limit]
    
    items = [
        MemorialCardResponse(
            id=m.id,
            full_name=m.full_name,
            birth_date=m.birth_date,
            death_date=m.death_date,
            privacy=(m.privacy.value if hasattr(m.privacy, "value") else m.privacy),
            images=[
                {"id": img.id, "url": _image_url_for_response(img.image_url), "order": img.image_order}
                for img in m.images
            ],
            created_at=m.created_at.isoformat(),
            status=(m.status.value if hasattr(m.status, "value") else m.status),
        )
        for m in paginated
    ]
    
    pages = (total + limit - 1) // limit
    
    return MemorialsListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )



async def _memorials_list_response(service, memorials, total, page, limit):
    """Build MemorialsListResponse with status and user_id on each card."""
    items = [
        MemorialCardResponse(
            id=m.id,
            full_name=m.full_name,
            birth_date=m.birth_date,
            death_date=m.death_date,
            privacy=(m.privacy.value if hasattr(m.privacy, "value") else m.privacy),
            images=[
                {"id": img.id, "url": _image_url_for_response(img.image_url), "order": img.image_order}
                for img in m.images
            ],
            created_at=m.created_at.isoformat(),
            status=(m.status.value if hasattr(m.status, "value") else m.status) if hasattr(m, "status") else None,
            user_id=getattr(m, "user_id", None),
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


@router.get("", response_model=MemorialsListResponse)
async def list_memorials_route(
    page: int = Query(1, ge=1),
    limit: int = Query(20, alias="page_size", ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = Query("approved", description="Filter: all, approved, pending"),
    featured: Optional[bool] = Query(False, description="If true, return only admin-marked featured memorials (for home page). No auth required."),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get memorials with optional status filter, search, or featured-only. Featured list is public (no auth)."""
    service = MemorialService(db)
    if featured:
        memorials, total = await service.get_featured_memorials(page=page, limit=limit)
    else:
        status_filter = status if status in ("all", "approved", "pending") else "approved"
        user_id = str(current_user.id) if current_user else None
        is_admin = getattr(current_user, "is_admin", False) if current_user else False
        memorials, total = await service.get_memorials_list(
            page=page, limit=limit, search=search, status_filter=status_filter, user_id=user_id, is_admin=is_admin
        )
    return await _memorials_list_response(service, memorials, total, page, limit)


@router.get("/{memorial_id}", response_model=MemorialResponse)
async def get_memorial(
    memorial_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get memorial details."""
    service = MemorialService(db)
    memorial = await service.get_memorial(memorial_id)
    
    if not memorial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found"
        )
    
    return MemorialResponse(
        id=memorial.id,
        full_name=memorial.full_name,
        birth_date=memorial.birth_date,
        death_date=memorial.death_date,
        story=memorial.story,
        privacy=(memorial.privacy.value if hasattr(memorial.privacy, "value") else memorial.privacy),
        status=(memorial.status.value if hasattr(memorial.status, "value") else memorial.status),
        user_id=memorial.user_id,
        is_featured=getattr(memorial, "is_featured", False),
        images=[
            {"id": img.id, "url": _image_url_for_response(img.image_url), "order": img.image_order}
            for img in memorial.images
        ],
        charities=[
            {"id": c.id, "name": c.name, "description": c.description, "url": c.url}
            for c in memorial.charities
        ],
        created_at=memorial.created_at.isoformat(),
        updated_at=memorial.updated_at.isoformat()
    )


@router.post("", response_model=MemorialCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_memorial(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new memorial."""
    service = MemorialService(db)
    # Support both JSON body and form-encoded data (tests use form-encoded)
    if request.headers.get("content-type", "").startswith("application/json"):
        payload = await request.json()
        memorial_in = MemorialCreate(**payload)
    else:
        form = await request.form()
        # form fields come as strings; handle optional parsing
        charity_ids = form.get("charity_ids")
        try:
            # tests send empty list as string '[]'
            import json
            charity_ids_val = json.loads(charity_ids) if charity_ids else []
        except Exception:
            charity_ids_val = []

        memorial_in = MemorialCreate(
            **{
                "name": form.get("name"),
                "birth_date": form.get("birth_date"),
                "death_date": form.get("death_date"),
                "bio": form.get("bio"),
                "privacy": form.get("privacy") or "public",
                "charity_ids": charity_ids_val,
            }
        )

    memorial = await service.create_memorial(
        current_user.id,
        memorial_in.full_name,
        memorial_in.birth_date,
        memorial_in.death_date,
        memorial_in.story,
        memorial_in.privacy,
        memorial_in.charity_ids or []
    )
    
    await db.commit()
    
    return {
        "id": memorial.id,
        "name": memorial.full_name,
        "status": (memorial.status.value if hasattr(memorial.status, "value") else memorial.status),
        "privacy": (memorial.privacy.value if hasattr(memorial.privacy, "value") else memorial.privacy),
        "message": "Memorial created successfully. It is pending approval.",
    }


@router.post("/{memorial_id}/upload-image", response_model=MemorialImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_memorial_image(
    memorial_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    """Upload an image for an existing memorial (owner only; max 2 images)."""
    service = MemorialService(db)
    memorial = await service.get_memorial(memorial_id)
    if not memorial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memorial not found")
    if memorial.user_id != current_user.id and not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the memorial owner can add images")
    if len(memorial.images) >= 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Memorial already has the maximum of 2 images")
    content_type = file.content_type or ""
    if not is_valid_image_mime_type(content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: JPEG, PNG, WebP",
        )
    contents = await file.read()
    if not is_valid_image_size(len(contents), settings.MAX_UPLOAD_SIZE):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB",
        )
    filename = file.filename or "image"
    if not any(filename.lower().endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")):
        filename = filename + ".jpg"
    path = await save_uploaded_file(contents, filename)
    order = len(memorial.images) + 1
    image = await service.add_memorial_image(memorial_id, path, order)
    await db.commit()
    return MemorialImageResponse(id=image.id, url=_image_url_for_response(image.image_url), order=image.image_order)


@router.put("/{memorial_id}", response_model=MemorialResponse)
async def update_memorial(
    memorial_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update memorial (owner only)."""
    service = MemorialService(db)
    memorial = await service.get_memorial(memorial_id)
    
    if not memorial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found"
        )
    
    if memorial.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update another user's memorial"
        )
    
    # Support form-encoded updates from tests
    if request.headers.get("content-type", "").startswith("application/json"):
        payload = await request.json()
        memorial_in = MemorialUpdate(**payload)
    else:
        form = await request.form()
        try:
            import json
            charity_ids_val = json.loads(form.get("charity_ids")) if form.get("charity_ids") else None
        except Exception:
            charity_ids_val = None

        memorial_in = MemorialUpdate(
            **{
                "name": form.get("name"),
                "birth_date": form.get("birth_date"),
                "death_date": form.get("death_date"),
                "bio": form.get("bio"),
                "privacy": form.get("privacy"),
                "charity_ids": charity_ids_val,
            }
        )

    memorial = await service.update_memorial(
        memorial_id,
        memorial_in.full_name,
        memorial_in.birth_date,
        memorial_in.death_date,
        memorial_in.story,
        memorial_in.privacy,
        memorial_in.charity_ids
    )
    
    await db.commit()
    
    return MemorialResponse(
        id=memorial.id,
        full_name=memorial.full_name,
        birth_date=memorial.birth_date,
        death_date=memorial.death_date,
        story=memorial.story,
        privacy=(memorial.privacy.value if hasattr(memorial.privacy, "value") else memorial.privacy),
        status=(memorial.status.value if hasattr(memorial.status, "value") else memorial.status),
        user_id=memorial.user_id,
        is_featured=getattr(memorial, "is_featured", False),
        images=[
            {"id": img.id, "url": _image_url_for_response(img.image_url), "order": img.image_order}
            for img in memorial.images
        ],
        charities=[
            {"id": c.id, "name": c.name, "description": c.description, "url": c.url}
            for c in memorial.charities
        ],
        created_at=memorial.created_at.isoformat(),
        updated_at=memorial.updated_at.isoformat()
    )


@router.delete("/{memorial_id}")
async def delete_memorial(
    memorial_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete memorial (owner or admin)."""
    service = MemorialService(db)
    memorial = await service.get_memorial(memorial_id)
    
    if not memorial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memorial not found"
        )
    
    if memorial.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete another user's memorial"
        )
    
    await service.delete_memorial(memorial_id)
    await db.commit()
    
    return {"message": "Memorial deleted successfully"}
