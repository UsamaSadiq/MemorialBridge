"""Pro plan and subscription endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/subscription", tags=["subscription"])


@router.get("/status")
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's subscription status."""
    return {
        "is_pro": current_user.is_pro,
        "is_admin": current_user.is_admin,
        "pro_features": {
            "can_add_images_to_comments": current_user.is_pro,
            "image_comments_per_memorial": 5 if current_user.is_pro else 0,
            "memorial_limit": 999999 if current_user.is_pro else 5,
            "storage_limit_mb": 999999 if current_user.is_pro else 100
        }
    }


@router.post("/upgrade")
async def upgrade_to_pro(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upgrade user to Pro (mocked - no payment processing)."""
    if current_user.is_pro:
        return {"message": "Already a Pro user"}
    
    current_user.is_pro = True
    await db.flush()
    await db.commit()
    
    return {
        "message": "Successfully upgraded to Pro",
        "is_pro": True
    }


@router.post("/downgrade")
async def downgrade_from_pro(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Downgrade from Pro (mocked)."""
    if not current_user.is_pro:
        return {"message": "Not a Pro user"}
    
    current_user.is_pro = False
    await db.flush()
    await db.commit()
    
    return {
        "message": "Successfully downgraded from Pro",
        "is_pro": False
    }
