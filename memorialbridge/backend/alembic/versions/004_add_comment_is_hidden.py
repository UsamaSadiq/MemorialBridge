"""Add is_hidden to comments table (admin hide tribute)"""
from alembic import op
import sqlalchemy as sa

revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "comments",
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("idx_comments_is_hidden", "comments", ["is_hidden"], unique=False)


def downgrade() -> None:
    op.drop_index("idx_comments_is_hidden", table_name="comments")
    op.drop_column("comments", "is_hidden")
