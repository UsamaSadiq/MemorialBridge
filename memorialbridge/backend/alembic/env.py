"""Alembic environment configuration."""
import sys
from pathlib import Path

# Add backend root so "app" is importable when running alembic from backend/
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from logging.config import fileConfig
from sqlalchemy import create_engine
from sqlalchemy import pool
from alembic import context
from app.core.config import get_settings
from app.models import Base

# This is the Alembic Config object
config = context.config

# Setup logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata
target_metadata = Base.metadata

settings = get_settings()


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    db_url = settings.get_database_url()
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = db_url

    with context.begin_transaction():
        context.configure(
            url=db_url,
            target_metadata=target_metadata,
            literal_binds=True,
            dialect_opts={"paramstyle": "named"},
        )

        with context.begin_transaction():
            context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Alembic needs a sync connection; convert async URL to sync (psycopg2)
    url = settings.get_database_url()
    if "+asyncpg" in url:
        url = url.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)
    connectable = create_engine(
        url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
