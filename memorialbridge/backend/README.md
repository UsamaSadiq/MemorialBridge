# Memorial Bridge Backend - FastAPI Application

**Version:** 1.0.0 (Milestone 1)  
**Status:** MVP Ready for Deployment

---

## Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Docker & Docker Compose (for containerized setup)

### Local Development Setup

**1. Create virtual environment:**
```bash
cd memorialbridge/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**2. Install dependencies:**
```bash
pip install -r requirements.txt
```

**3. Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

**4. Initialize database:**
```bash
# Using Alembic
alembic upgrade head

# Or let FastAPI create tables on startup
python -m uvicorn app.main:app --reload
```

**5. Run development server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**6. Access the application:**
- API: http://localhost:8000
- API Docs (Swagger UI): http://localhost:8000/docs
- Alternative Docs (ReDoc): http://localhost:8000/redoc

---

## Docker Setup

**Build and run with Docker Compose:**
```bash
cd memorialbridge
docker-compose up --build
```

This starts:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- Frontend on port 3000

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   └── endpoints/
│   │   │       ├── auth.py          # Authentication endpoints
│   │   │       ├── memorial.py      # Memorial CRUD endpoints
│   │   │       ├── comment.py       # Comment endpoints
│   │   │       ├── charity.py       # Charity endpoints
│   │   │       ├── admin.py         # Admin moderation endpoints
│   │   │       └── subscription.py  # Pro plan endpoints
│   │   └── dependencies.py           # Auth dependency injection
│   ├── core/
│   │   ├── config.py                 # Configuration management
│   │   ├── security.py               # Password & JWT utilities
│   │   └── validators.py             # Input validation
│   ├── models/                       # SQLAlchemy ORM models
│   ├── schemas/                      # Pydantic request/response schemas
│   ├── services/                     # Business logic layer
│   ├── repositories/                 # Data access layer
│   ├── utils/                        # Helper functions
│   ├── db/
│   │   ├── session.py                # Database connection
│   │   └── __init__.py
│   └── main.py                       # FastAPI application
├── tests/                            # Test suite
├── alembic/                          # Database migrations
├── Dockerfile                        # Container configuration
├── requirements.txt                  # Python dependencies
└── .env.example                      # Environment template
```

---

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user

### Memorials (`/api/v1/memorials`)
- `GET /` - List public memorials (paginated)
- `GET /{memorial_id}` - Get memorial detail
- `GET /my` - Get user's memorials
- `POST /` - Create memorial (auth required)
- `PUT /{memorial_id}` - Update memorial (owner only)
- `DELETE /{memorial_id}` - Delete memorial (owner only)

### Comments (`/api/v1/memorials/{memorial_id}/comments`)
- `GET /` - List comments (paginated)
- `POST /` - Create comment (auth required)
- `DELETE /comments/{comment_id}` - Delete comment (owner only)

### Charities (`/api/v1/charities`)
- `GET /` - List active charities
- `GET /{charity_id}` - Get charity detail

### Admin (`/api/v1/admin`)
- `GET /memorials/pending` - List pending memorials (admin only)
- `POST /memorials/{memorial_id}/approve` - Approve memorial
- `POST /memorials/{memorial_id}/reject` - Reject memorial
- `GET /comments/flagged` - List flagged comments
- `POST /comments/{comment_id}/flag` - Flag comment
- `POST /comments/{comment_id}/unflag` - Remove flag

### Subscription (`/api/v1/subscription`)
- `GET /status` - Get subscription status
- `POST /upgrade` - Upgrade to Pro (mocked)
- `POST /downgrade` - Downgrade from Pro (mocked)

---

## Database

**Database Type:** PostgreSQL 14+  
**ORM:** SQLAlchemy 2.0 with async support  
**Migrations:** Alembic

### Tables
- `users` - User accounts and authentication
- `memorials` - Memorial records
- `memorial_images` - Images for memorials
- `comments` - User comments on memorials
- `charities` - Charitable organizations
- `memorial_charities` - Memorial-charity associations

See [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) for full schema documentation.

### Running Migrations

**If you see `role "user" does not exist`:** Alembic is connecting to a PostgreSQL that doesn’t have the `user` role (e.g. your system Postgres). The Docker Compose DB creates that role. Use one of these:

**Option A – Use the Docker DB (recommended)**  
From the **memorialbridge** directory (parent of `backend`):

```bash
# Start the database container
docker compose up -d db

# Run migrations from your host (backend directory); uses default DATABASE_URL
cd backend && alembic upgrade head
```

**Option B – Run migrations inside Docker**  
From the **memorialbridge** directory:

```bash
docker compose run --rm backend alembic upgrade head
```

**Other migration commands:**
```bash
# Generate migration from model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# View migration history
alembic current
```

---

## Environment Configuration

**Key environment variables:**

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/memorialbridge

# Security
SECRET_KEY=your-secure-random-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7

# Application
ENVIRONMENT=development
DEBUG=true
APP_TITLE="Memorial Bridge API"
APP_VERSION=1.0.0

# File uploads
MAX_UPLOAD_SIZE=5242880  # 5MB
UPLOAD_DIR=uploads
```

### Production Checklist
- [ ] Set strong `SECRET_KEY` (min 32 characters, random)
- [ ] Use environment variables from secure storage
- [ ] Set `ENVIRONMENT=production`
- [ ] Set `DEBUG=false`
- [ ] Enable HTTPS
- [ ] Configure appropriate CORS origins
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up error tracking (Sentry, etc.)

---

## Authentication

### JWT Token Flow
1. User registers/logs in
2. Server returns JWT token
3. Client stores token in localStorage/sessionStorage
4. Client sends token in `Authorization: Bearer <token>` header
5. Server validates token on each request
6. Expired tokens return 401 Unauthorized

### Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "is_pro": false,
  "is_admin": false,
  "exp": 1706592000,
  "iat": 1705987200
}
```

### Security Features
- Bcrypt password hashing with salting
- JWT tokens with 7-day expiration
- HTTPBearer authentication scheme
- Admin role enforcement for protected endpoints
- Rate limiting ready (to be added)

---

## Testing

### Run Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run verbose output
pytest -v
```

### Test Structure
- `tests/unit/` - Unit tests for utilities, validators
- `tests/integration/` - Integration tests for endpoints
- `tests/e2e/` - End-to-end tests for workflows

See [TESTING_AND_DOCS_TRACKING.md](../TESTING_AND_DOCS_TRACKING.md) for full testing requirements.

---

## Error Handling

### Standard Error Response Format
```json
{
  "detail": "Descriptive error message"
}
```

### Common Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Performance & Optimization

### Database Optimizations
- Async queries via SQLAlchemy asyncio
- Connection pooling with NullPool for dev
- Indexed foreign keys for JOIN performance
- Composite indexes for common queries
- Pagination enforced (max 100 items per request)

### Caching Strategy (Future)
- Redis caching for public memorials
- Cache invalidation on updates
- TTL-based cache expiration

### Monitoring & Logging
- Structured logging with Python logging
- Request/response logging
- Performance metrics tracking
- Error tracking integration ready

---

## Deployment

### Docker Deployment
```bash
# Build image
docker build -t memorialbridge-backend:latest .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql+asyncpg://... \
  -e SECRET_KEY=... \
  memorialbridge-backend:latest
```

### Kubernetes (Future)
- Helm charts ready
- Horizontal scaling support
- Health check endpoints configured

---

## Contributing

### Code Style
```bash
# Format code
black app/

# Check linting
flake8 app/

# Type checking
mypy app/
```

### Commit Message Format
```
<Type>: <Short description>

<Detailed description if needed>

Related to: <Issue/Epic number>
```

### Types: Epic, Feature, Bugfix, Documentation, Chore

---

## Known Limitations & Future Work

### Current MVP (M1)
✅ User authentication  
✅ Memorial creation and management  
✅ Public memorial gallery  
✅ Comment system  
✅ Charity association  
✅ Admin moderation  
✅ Pro plan mocking (no payments)  

### Post-M1 Enhancements
- [ ] Email verification on signup
- [ ] Password reset via email
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Refresh token rotation
- [ ] Real payment processing
- [ ] Advanced search and filtering
- [ ] Social media sharing
- [ ] Email notifications
- [ ] Analytics dashboard

---

## Support & Contact

For issues, questions, or suggestions:
- Create an issue in the repository
- Check [EPIC_1_1_IMPLEMENTATION.md](../EPIC_1_1_IMPLEMENTATION.md) for authentication details
- Check [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) for schema documentation

---

## License

Proprietary - Memorial Bridge Project

---

## Changelog

### Version 1.0.0 (Milestone 1) - January 28, 2026
- ✅ Initial MVP release
- ✅ User authentication system
- ✅ Memorial management (CRUD)
- ✅ Public gallery with search
- ✅ Comment system
- ✅ Charity integration
- ✅ Admin moderation dashboard
- ✅ Pro plan feature flags (mocked)
- ✅ Docker containerization
- ✅ Comprehensive documentation

See git commit history for detailed changes.
