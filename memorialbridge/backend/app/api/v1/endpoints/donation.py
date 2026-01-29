"""Donation endpoints: list user donations and stats. No donation model yet; returns empty data."""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.api.dependencies import get_current_user
from app.models import User
from app.schemas.donation import DonationResponse, DonationStatsResponse

router = APIRouter(prefix="/donations", tags=["donations"])


@router.get("", response_model=list[DonationResponse])
async def list_donations(
    status: Optional[str] = Query(None, description="Filter: all (omit), completed, pending, failed"),
    sortBy: Optional[str] = Query("recent", description="Sort: recent, amount"),
    current_user: User = Depends(get_current_user),
):
    """List donations for the current user. Returns empty list until donation storage is implemented."""
    # Accept both query param styles; frontend sends sortBy=recent
    _ = status, sortBy, current_user
    return []


@router.get("/stats", response_model=DonationStatsResponse)
async def get_donation_stats(
    current_user: User = Depends(get_current_user),
):
    """Get donation stats for the current user. Returns zeros until donation storage is implemented."""
    _ = current_user
    return DonationStatsResponse(
        totalDonated=0.0,
        donationCount=0,
        averageDonation=0.0,
        favorites=[],
    )
