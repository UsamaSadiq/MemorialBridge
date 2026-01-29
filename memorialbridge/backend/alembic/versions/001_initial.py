"""Create initial schema"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic
revision = "001"
down_revision = None
branch_labels = None
depends_on = None

# PostgreSQL ENUM types (must match app models).
# create_type=False so table creation does not try to CREATE TYPE again (we create once below).
MEMORIAL_PRIVACY = postgresql.ENUM("public", "link-only", name="memorialprivacy", create_type=False)
MEMORIAL_STATUS = postgresql.ENUM("pending", "approved", "rejected", name="memorialstatus", create_type=False)


def upgrade() -> None:
    """Upgrade database schema."""
    # Create ENUM types first (used by memorials table)
    MEMORIAL_PRIVACY.create(op.get_bind(), checkfirst=True)
    MEMORIAL_STATUS.create(op.get_bind(), checkfirst=True)

    # users (without first_name, last_name — added in 002)
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, index=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("is_pro", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("last_login", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("email", name="users_email_key"),
    )

    # memorials (without is_featured — added in 003)
    op.create_table(
        "memorials",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("death_date", sa.Date(), nullable=True),
        sa.Column("story", sa.Text(), nullable=True),
        sa.Column(
            "privacy",
            MEMORIAL_PRIVACY,
            nullable=False,
            server_default="public",
        ),
        sa.Column(
            "status",
            MEMORIAL_STATUS,
            nullable=False,
            server_default="pending",
            index=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
            index=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("approved_by", sa.String(36), sa.ForeignKey("users.id"), nullable=True),
        sa.CheckConstraint(
            "death_date IS NULL OR birth_date IS NULL OR death_date >= birth_date",
            name="valid_dates",
        ),
    )
    op.create_index("idx_memorials_status", "memorials", ["status"], unique=False)
    op.create_index("idx_memorials_privacy_status", "memorials", ["privacy", "status"], unique=False)
    op.create_index("idx_memorials_user_id", "memorials", ["user_id"], unique=False)

    # memorial_images
    op.create_table(
        "memorial_images",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "memorial_id",
            sa.String(36),
            sa.ForeignKey("memorials.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("image_url", sa.String(500), nullable=False),
        sa.Column("image_order", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.UniqueConstraint("memorial_id", "image_order", name="uq_memorial_image_order"),
        sa.CheckConstraint("image_order >= 1 AND image_order <= 2", name="valid_image_order"),
    )

    # comments (without is_hidden — added in 004)
    op.create_table(
        "comments",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "memorial_id",
            sa.String(36),
            sa.ForeignKey("memorials.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("image_url", sa.String(500), nullable=True),
        sa.Column("is_flagged", sa.Boolean(), nullable=False, server_default=sa.false(), index=True),
        sa.Column("flagged_reason", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
            index=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index("idx_comments_memorial_id", "comments", ["memorial_id"], unique=False)
    op.create_index("idx_comments_user_id", "comments", ["user_id"], unique=False)
    op.create_index("idx_comments_is_flagged", "comments", ["is_flagged"], unique=False)
    op.create_index("idx_comments_user_memorial", "comments", ["user_id", "memorial_id"], unique=False)

    # charities
    op.create_table(
        "charities",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("url", sa.String(500), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true(), index=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index("idx_charities_is_active", "charities", ["is_active"], unique=False)

    # memorial_charities (junction)
    op.create_table(
        "memorial_charities",
        sa.Column(
            "memorial_id",
            sa.String(36),
            sa.ForeignKey("memorials.id", ondelete="CASCADE"),
            primary_key=True,
            index=True,
        ),
        sa.Column(
            "charity_id",
            sa.String(36),
            sa.ForeignKey("charities.id", ondelete="CASCADE"),
            primary_key=True,
            index=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index(
        "idx_memorial_charities_memorial_id",
        "memorial_charities",
        ["memorial_id"],
        unique=False,
    )
    op.create_index(
        "idx_memorial_charities_charity_id",
        "memorial_charities",
        ["charity_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade database schema."""
    op.drop_table("memorial_charities")
    op.drop_table("charities")
    op.drop_table("comments")
    op.drop_table("memorial_images")
    op.drop_table("memorials")
    op.drop_table("users")

    MEMORIAL_STATUS.drop(op.get_bind(), checkfirst=True)
    MEMORIAL_PRIVACY.drop(op.get_bind(), checkfirst=True)
