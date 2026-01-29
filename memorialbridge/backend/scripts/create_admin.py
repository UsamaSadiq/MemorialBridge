#!/usr/bin/env python3
"""
Create or promote an admin user.

Usage (set env vars so password is not in shell history):
  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='YourSecurePass123!' \\
    python scripts/create_admin.py

Or with Docker:
  docker-compose exec backend env ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='YourSecurePass123!' \\
    python scripts/create_admin.py

Password must meet: 8+ chars, 1 upper, 1 lower, 1 digit, 1 special.
"""
import asyncio
import os
import sys
from pathlib import Path

# Ensure backend root is on path (when run from /app in Docker)
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from app.db.session import AsyncSessionLocal
from app.repositories.user import UserRepository
from app.core.security import hash_password
from app.core.validators import validate_email, validate_password


async def main() -> int:
    email = (os.environ.get("ADMIN_EMAIL") or "").strip()
    password = os.environ.get("ADMIN_PASSWORD") or ""

    if not email:
        print("Set ADMIN_EMAIL environment variable.", file=sys.stderr)
        return 1
    if not password:
        print("Set ADMIN_PASSWORD environment variable.", file=sys.stderr)
        return 1
    if not validate_email(email):
        print("Invalid ADMIN_EMAIL format.", file=sys.stderr)
        return 1
    is_valid, msg = validate_password(password)
    if not is_valid:
        print(f"Invalid ADMIN_PASSWORD: {msg}", file=sys.stderr)
        return 1

    async with AsyncSessionLocal() as session:
        repo = UserRepository(session)
        user = await repo.get_by_email(email)
        if user:
            user.is_admin = True
            session.add(user)
            await session.commit()
            print(f"User {email} promoted to admin.")
        else:
            hashed = hash_password(password)
            await repo.create({
                "email": email,
                "password_hash": hashed,
                "is_admin": True,
                "is_pro": False,
            })
            await session.commit()
            print(f"Admin user created: {email}")

    print("You can now log in at the app and use the admin portal to approve memorials or mark them as featured.")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
