"""Donation schemas."""
from pydantic import BaseModel
from typing import Optional, List


class DonationResponse(BaseModel):
    """Single donation response (matches frontend Donation interface)."""
    id: str
    fundraiserId: str
    fundraiserName: str
    charityName: str
    amount: float
    message: Optional[str] = None
    createdAt: str
    status: str  # 'completed' | 'pending' | 'failed'
    receiptUrl: Optional[str] = None


class DonationStatsResponse(BaseModel):
    """Donation stats (matches frontend DonationStats interface)."""
    totalDonated: float
    donationCount: int
    averageDonation: float
    favorites: List[dict]  # [{ charityName, count, total }]
