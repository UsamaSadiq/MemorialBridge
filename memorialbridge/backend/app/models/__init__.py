"""
Database models using SQLAlchemy ORM.
"""
from sqlalchemy import (
    Column, String, DateTime, Boolean, Text, Date,
    ForeignKey, Integer, Enum, Index, CheckConstraint,
    UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

Base = declarative_base()


def generate_uuid():
    """Generate a UUID for database IDs."""
    return str(uuid.uuid4())


class MemorialStatus(str, enum.Enum):
    """Memorial status enumeration."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class MemorialPrivacy(str, enum.Enum):
    """Memorial privacy enumeration."""
    PUBLIC = "public"
    LINK_ONLY = "link-only"


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    is_pro = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    memorials = relationship("Memorial", back_populates="creator", foreign_keys="Memorial.user_id", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class Memorial(Base):
    """Memorial model."""
    __tablename__ = "memorials"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=True)
    death_date = Column(Date, nullable=True)
    story = Column(Text, nullable=True)
    privacy = Column(
        Enum(MemorialPrivacy, values_callable=lambda x: [e.value for e in x]),
        default=MemorialPrivacy.PUBLIC,
        nullable=False
    )
    status = Column(
        Enum(MemorialStatus, values_callable=lambda x: [e.value for e in x]),
        default=MemorialStatus.PENDING,
        nullable=False,
        index=True
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    approved_at = Column(DateTime(timezone=True), nullable=True)
    approved_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    creator = relationship("User", back_populates="memorials", foreign_keys=[user_id])
    images = relationship("MemorialImage", back_populates="memorial", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="memorial", cascade="all, delete-orphan")
    charities = relationship(
        "Charity",
        secondary="memorial_charities",
        back_populates="memorials"
    )
    
    # Indexes
    __table_args__ = (
        Index("idx_memorials_status", "status"),
        Index("idx_memorials_privacy_status", "privacy", "status"),
        Index("idx_memorials_user_id", "user_id"),
        Index("idx_memorials_is_featured", "is_featured"),
        CheckConstraint(
            "death_date IS NULL OR birth_date IS NULL OR death_date >= birth_date",
            name="valid_dates"
        ),
    )
    
    def __repr__(self):
        return f"<Memorial(id={self.id}, full_name={self.full_name})>"


class MemorialImage(Base):
    """Memorial image model."""
    __tablename__ = "memorial_images"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    memorial_id = Column(String(36), ForeignKey("memorials.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    image_order = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    
    # Relationships
    memorial = relationship("Memorial", back_populates="images")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("memorial_id", "image_order", name="uq_memorial_image_order"),
        CheckConstraint("image_order >= 1 AND image_order <= 2", name="valid_image_order"),
    )
    
    def __repr__(self):
        return f"<MemorialImage(id={self.id}, memorial_id={self.memorial_id})>"


class Comment(Base):
    """Comment model."""
    __tablename__ = "comments"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    memorial_id = Column(String(36), ForeignKey("memorials.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    is_flagged = Column(Boolean, default=False, index=True)
    flagged_reason = Column(Text, nullable=True)
    is_hidden = Column(Boolean, default=False, index=True)  # Admin can hide inappropriate tributes
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    
    # Relationships
    memorial = relationship("Memorial", back_populates="comments")
    user = relationship("User", back_populates="comments")
    
    # Indexes
    __table_args__ = (
        Index("idx_comments_memorial_id", "memorial_id"),
        Index("idx_comments_user_id", "user_id"),
        Index("idx_comments_is_flagged", "is_flagged"),
        Index("idx_comments_user_memorial", "user_id", "memorial_id"),
    )
    
    def __repr__(self):
        return f"<Comment(id={self.id}, memorial_id={self.memorial_id})>"


class Charity(Base):
    """Charity model."""
    __tablename__ = "charities"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    
    # Relationships
    memorials = relationship(
        "Memorial",
        secondary="memorial_charities",
        back_populates="charities"
    )
    
    def __repr__(self):
        return f"<Charity(id={self.id}, name={self.name})>"


class MemorialCharities(Base):
    """Memorial-Charities junction table."""
    __tablename__ = "memorial_charities"
    
    memorial_id = Column(String(36), ForeignKey("memorials.id", ondelete="CASCADE"), primary_key=True, index=True)
    charity_id = Column(String(36), ForeignKey("charities.id", ondelete="CASCADE"), primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
