# Docker Deployment & Testing Guide

## Overview
This guide covers deploying Memorial Bridge using Docker Compose for local development and testing.

## Prerequisites
- Docker (v20.10+)
- Docker Compose (v2.0+)
- PostgreSQL will run in container
- No local Python/Node installation needed

## Quick Start

### 1. Setup Environment Variables
```bash
# Create .env file (optional, uses defaults in docker-compose.yml)
cat > .env << EOF
SECRET_KEY=your-256-bit-secret-key-here-change-in-production
ENVIRONMENT=development
DEBUG=true
EOF
```

### 2. Start All Services
```bash
docker-compose up -d
```

This will:
- Build backend image from `backend/Dockerfile`
- Build frontend image from `frontend/Dockerfile`
- Create PostgreSQL container
- Start all services with proper networking

### 3. Verify Services are Running
```bash
docker-compose ps
```

Expected output:
```
NAME        STATUS         PORTS
backend     Up (healthy)   0.0.0.0:8000->8000/tcp
frontend    Up (healthy)   0.0.0.0:3000->3000/tcp
db          Up (healthy)   0.0.0.0:5432->5432/tcp
```

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:8000 | REST API endpoints |
| API Docs | http://localhost:8000/docs | Interactive OpenAPI/Swagger UI |
| Frontend | http://localhost:3000 | React web application |
| Database | localhost:5432 | PostgreSQL (internal only) |

## Testing

### 1. Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-28T10:30:00Z"
}
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 4. Test Memorial Creation (with Auth Token)
```bash
TOKEN="your-jwt-token-from-login"

curl -X POST http://localhost:8000/api/v1/memorials \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=John Doe" \
  -F "birth_date=1950-05-15" \
  -F "death_date=2024-01-15" \
  -F "bio=Beloved father" \
  -F "privacy=public" \
  -F "charity_ids=[]"
```

### 5. View API Documentation
Open browser: http://localhost:8000/docs

This provides interactive API documentation where you can:
- Test endpoints directly
- See request/response schemas
- Copy curl commands

### 6. Database Access
```bash
# Connect to PostgreSQL inside container
docker-compose exec db psql -U user -d memorialbridge

# Common commands:
\dt                          # List tables
SELECT * FROM "user";        # Query users
\q                           # Exit
```

## Running Tests

### Option 1: Tests Inside Backend Container
```bash
docker-compose exec backend python -m pytest tests/ -v
```

### Option 2: Tests from Host (requires Python env)
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run tests
python -m pytest tests/ -v --cov=backend/app
```

## Troubleshooting

### Issue: Ports Already in Use
```bash
# Change port mappings in docker-compose.yml
# Then restart:
docker-compose down
docker-compose up -d
```

### Issue: Database Connection Error
```bash
# Check database health
docker-compose exec db pg_isready -U user

# View database logs
docker-compose logs db
```

### Issue: Backend Won't Start
```bash
# View backend logs
docker-compose logs backend

# Check if all migrations ran
docker-compose exec backend alembic current
```

### Issue: Frontend Can't Connect to Backend
1. Verify backend is running: `docker-compose exec backend curl http://localhost:8000/health`
2. Check CORS settings in `backend/app/main.py`
3. Verify `VITE_API_URL` in frontend container matches backend URL

## Development Workflow

### 1. Hot Reload Code Changes
Files in `./backend` and `./frontend` are mounted as volumes:
- Backend changes automatically trigger uvicorn reload
- Frontend changes automatically trigger Vite HMR

### 2. Install New Backend Dependencies
```bash
# Add to backend/requirements.txt, then:
docker-compose exec backend pip install -r requirements.txt
```

### 3. Run Database Migrations
```bash
docker-compose exec backend alembic upgrade head
```

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Deployment Checklist

- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Change `SECRET_KEY` to secure random value (256+ bits)
- [ ] Set `DEBUG=false`
- [ ] Use strong database password
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set up automated backups for PostgreSQL
- [ ] Configure external image registry (Docker Hub/ECR)
- [ ] Set up CI/CD pipeline for auto-deployment
- [ ] Monitor logs and metrics
- [ ] Set up error tracking (Sentry/Datadog)

## Common Commands

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start all services in background |
| `docker-compose down` | Stop and remove containers |
| `docker-compose logs -f backend` | View backend logs in real-time |
| `docker-compose exec backend bash` | Access backend container shell |
| `docker-compose ps` | Show running containers |
| `docker-compose restart backend` | Restart a service |
| `docker volume ls` | List persistent volumes |

## Performance Notes

- PostgreSQL uses persistent volume (`postgres_data`) for data retention
- Backend uses code volume mount for development reload
- Database connection pooling configured for 10-20 connections
- Frontend serves via Vite dev server (production uses nginx)

## Security Considerations

- Database credentials are in `docker-compose.yml` (change for production)
- `SECRET_KEY` needs secure random generation
- All services communicate through internal Docker network
- Ports 5432 (database) should not be exposed in production
- Use environment file (`.env`) for sensitive values
- Enable authentication for all API endpoints

## Next Steps

1. Test API endpoints using curl or Postman
2. Verify frontend can connect and authenticate
3. Test end-to-end workflows (signup → create memorial → comment)
4. Run full test suite: `pytest tests/ -v`
5. Monitor logs for any errors or warnings
6. Prepare for production deployment

---

For more information, see:
- [Backend README](backend/README.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Testing Guide](TESTING_AND_DOCS_TRACKING.md)
