"""Add is_featured to memorials table"""
from alembic import op
import sqlalchemy as sa

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "memorials",
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("idx_memorials_is_featured", "memorials", ["is_featured"], unique=False)


def downgrade() -> None:
    op.drop_index("idx_memorials_is_featured", table_name="memorials")
    op.drop_column("memorials", "is_featured")
