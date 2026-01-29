# Project Rules & Development Guidelines

**Memorial Bridge - Milestone 1 and Beyond**

This document defines the standards, conventions, and requirements that all developers must follow when contributing to the Memorial Bridge project.

---

## Table of Contents

1. [Project Standards](#project-standards)
2. [Code Organization](#code-organization)
3. [API Design Guidelines](#api-design-guidelines)
4. [Database & ORM Guidelines](#database--orm-guidelines)
5. [Security Requirements](#security-requirements)
6. [Testing Requirements](#testing-requirements)
7. [Documentation Requirements](#documentation-requirements)
8. [Code Quality Standards](#code-quality-standards)
9. [Git & Version Control](#git--version-control)
10. [Performance Guidelines](#performance-guidelines)
11. [Naming Conventions](#naming-conventions)

---

## Project Standards

### Technology Stack
- **Backend Framework:** FastAPI 0.104+
- **ORM:** SQLAlchemy 2.0+ with async support
- **Database:** PostgreSQL 15+
- **Python Version:** 3.10+
- **Testing:** Pytest 7.4+ with asyncio support
- **Authentication:** JWT with HS256, Bcrypt for passwords
- **Containerization:** Docker & Docker Compose

### Architecture Pattern
- **Layered Architecture:** API → Services → Repositories → Models
- **API Style:** RESTful with JSON payloads
- **Database:** Async operations with connection pooling
- **Validation:** Pydantic v2 for request/response schemas

### Project Scope
- **MVP Status:** Milestone 1 complete, production-ready backend
- **Focus Areas:** Authentication, data management, admin moderation
- **Target:** End-users and content creators
- **Deployment:** Docker containerization for consistency

---

## Code Organization

### Directory Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── dependencies.py          # Dependency injection (auth, db)
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── auth.py          # Authentication endpoints
│   │           ├── memorial.py      # Memorial CRUD endpoints
│   │           ├── comment.py       # Comment endpoints
│   │           ├── charity.py       # Charity endpoints
│   │           ├── admin.py         # Admin moderation endpoints
│   │           └── subscription.py  # Subscription endpoints
│   ├── core/
│   │   ├── config.py                # Settings and configuration
│   │   ├── security.py              # JWT and password utilities
│   │   └── validators.py            # Validation functions
│   ├── models/                      # SQLAlchemy ORM models
│   ├── schemas/                     # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── memorial.py
│   │   ├── comment.py
│   │   ├── charity.py
│   │   └── __init__.py
│   ├── services/                    # Business logic layer
│   │   ├── auth.py
│   │   ├── memorial.py
│   │   ├── comment.py
│   │   ├── charity.py
│   │   └── __init__.py
│   ├── repositories/                # Data access layer
│   │   ├── base.py                  # BaseRepository class
│   │   ├── user.py
│   │   ├── memorial.py
│   │   ├── comment.py
│   │   ├── charity.py
│   │   └── __init__.py
│   ├── db/
│   │   ├── session.py               # Database connection and session
│   │   └── __init__.py
│   ├── utils/                       # Utility functions
│   │   ├── file_upload.py
│   │   ├── image_processing.py
│   │   └── __init__.py
│   ├── main.py                      # FastAPI app initialization
│   └── __init__.py
├── requirements.txt
├── Dockerfile
├── alembic/                         # Database migrations
└── README.md
```

### Module Organization Rules

1. **Keep modules focused:** Each module should have a single responsibility
2. **Max file size:** 500 lines (split if larger)
3. **Max function size:** 50 lines (refactor if larger)
4. **Imports:** Group by stdlib, third-party, local (in that order)
5. **Lazy imports:** Use only for optional dependencies

---

## API Design Guidelines

### Endpoint Structure

**Pattern:** `/{version}/{resource}/{action}`

```
GET    /api/v1/memorials                  # List resource
GET    /api/v1/memorials/{id}             # Get resource
POST   /api/v1/memorials                  # Create resource
PUT    /api/v1/memorials/{id}             # Update resource
DELETE /api/v1/memorials/{id}             # Delete resource
POST   /api/v1/memorials/{id}/approve     # Custom action
```

### Endpoint Rules

1. **Versioning:** Always use `/api/v1/` prefix for consistency
2. **Resource Names:** Use lowercase plural nouns (memorials, comments)
3. **IDs:** Use UUIDs for all resource identifiers
4. **HTTP Methods:**
   - `GET` - Retrieve resource(s), safe and idempotent
   - `POST` - Create resource, can have side effects
   - `PUT` - Full update of resource
   - `PATCH` - Partial update of resource (when applicable)
   - `DELETE` - Remove resource
5. **Status Codes:**
   - `200 OK` - Successful GET/PUT
   - `201 Created` - Successful POST
   - `204 No Content` - Successful DELETE
   - `400 Bad Request` - Invalid input
   - `401 Unauthorized` - Missing/invalid auth
   - `403 Forbidden` - Authenticated but not allowed
   - `404 Not Found` - Resource doesn't exist
   - `409 Conflict` - Resource already exists or state conflict
   - `422 Unprocessable Entity` - Validation error
   - `500 Internal Server Error` - Unexpected server error

### Request/Response Format

1. **Content-Type:** Always `application/json` (except file uploads: `multipart/form-data`)
2. **Response Envelope:**
   ```json
   {
     "id": "uuid",
     "field": "value",
     "created_at": "2024-01-28T10:00:00Z",
     "updated_at": "2024-01-28T10:00:00Z"
   }
   ```
3. **List Response:**
   ```json
   {
     "items": [...],
     "total": 100,
     "page": 1,
     "page_size": 20
   }
   ```
4. **Error Response:**
   ```json
   {
     "detail": "Error message",
     "error_code": "ERROR_CODE"
   }
   ```

### Endpoint Documentation

Every endpoint must include:
- Clear docstring with description
- Parameter documentation
- Return value documentation
- Exception documentation
- Example use cases in docstring

```python
@router.post("/memorials", status_code=201, response_model=MemorialResponse)
async def create_memorial(
    memorial_data: MemorialCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> MemorialResponse:
    """
    Create a new memorial.
    
    Args:
        memorial_data: Memorial creation data with name, dates, bio, images
        current_user: Authenticated user (from JWT token)
        db: Database session
    
    Returns:
        Created memorial with id, timestamps, status (auto-pending)
    
    Raises:
        HTTPException: If dates invalid or images > 2
        HTTPException: If user not authenticated
    
    Example:
        POST /api/v1/memorials
        {"name": "John Doe", "birth_date": "1950-05-15", ...}
    """
```

### Pagination Rules

1. **Default page_size:** 20 items
2. **Max page_size:** 100 items
3. **Query params:** `?page=1&page_size=20`
4. **Always return:** total count and current page number
5. **Validation:** Page must be >= 1, page_size between 1 and 100

### Filtering Rules

1. **Filter by status:** `/api/v1/memorials?status=approved`
2. **Search:** `/api/v1/memorials?search=john` (case-insensitive)
3. **Multiple filters:** `/api/v1/memorials?status=approved&privacy=public`
4. **Sorting:** `/api/v1/memorials?sort=-created_at` (prefix `-` for descending)

---

## Database & ORM Guidelines

### Model Design

1. **Primary Key:** Always use UUID as primary key
   ```python
   id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
   ```

2. **Timestamps:** Every table must have created_at and updated_at
   ```python
   created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
   updated_at: Mapped[datetime] = mapped_column(
       default=datetime.utcnow,
       onupdate=datetime.utcnow
   )
   ```

3. **Relationships:** Use explicit foreign keys with cascade deletes where appropriate
   ```python
   user: Mapped["User"] = relationship(
       "User",
       back_populates="memorials",
       foreign_keys=[user_id],
       cascade="all, delete-orphan"
   )
   ```

4. **Constraints:** Define at model level when possible
   ```python
   __table_args__ = (
       UniqueConstraint('email', name='uq_user_email'),
       Index('idx_status', 'status'),
   )
   ```

5. **Enums:** Use SQLAlchemy enums for status/state fields
   ```python
   from enum import Enum
   class MemorialStatus(str, Enum):
       PENDING = "pending"
       APPROVED = "approved"
       REJECTED = "rejected"
   
   status: Mapped[MemorialStatus] = mapped_column(default=MemorialStatus.PENDING)
   ```

### Query Guidelines

1. **Always use async:** Never use blocking database operations
   ```python
   result = await db.execute(select(User).where(User.email == email))
   ```

2. **Use select() not query():** Modern SQLAlchemy pattern
   ```python
   stmt = select(User).where(User.id == user_id)
   result = await db.execute(stmt)
   user = result.scalar_one_or_none()
   ```

3. **Eager loading:** Use joinedload for relationships you need
   ```python
   stmt = select(Memorial).options(joinedload(Memorial.images))
   ```

4. **Avoid N+1 queries:** Always think about relationships

5. **Pagination in queries:**
   ```python
   stmt = select(User).offset(skip).limit(limit)
   ```

6. **Filtering:**
   ```python
   stmt = select(User).where(User.is_active == True)
   stmt = stmt.where(User.created_at >= start_date)
   ```

### Index Rules

1. **Index on foreign keys:** Automatic in SQLAlchemy
2. **Index on frequently searched columns:** status, created_at, user_id
3. **Index on unique columns:** email
4. **Composite indexes:** When querying multiple columns together
5. **Document indexes:** Add comment explaining why index exists

### Schema Versioning

1. **Use Alembic for migrations:** Never modify schema manually
2. **Commit migrations:** All migrations go to version control
3. **Naming:** `YYYY-MM-DD_HH-MM-SS_description`
4. **Testing:** Run migrations on test database before production

---

## Security Requirements

### Authentication

1. **Always require authentication** for:
   - Any endpoint that modifies data (POST, PUT, DELETE)
   - Any endpoint accessing user-specific data
   - All admin endpoints

2. **JWT Configuration:**
   - Algorithm: HS256
   - Expiration: 7 days (configurable)
   - Secret: Minimum 256 bits, secure random generation
   - Token refresh: Implement for long-running sessions

3. **Use dependency injection:**
   ```python
   async def get_current_user(
       credentials: HTTPAuthorizationCredentials = Depends(security),
       db: AsyncSession = Depends(get_db)
   ) -> User:
       """Extract and verify JWT token."""
   ```

### Password Security

1. **Minimum requirements:**
   - 8+ characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **Hashing:**
   - Algorithm: Bcrypt
   - Rounds: 12+ (automatic with passlib)
   - Never store plaintext passwords
   - Never return password_hash in responses

3. **Validation:**
   ```python
   is_valid, error_msg = validate_password(password)
   if not is_valid:
       raise HTTPException(status_code=400, detail=error_msg)
   ```

### Authorization

1. **Role-based access control:**
   - `User` - Standard authenticated user
   - `Admin` - Can moderate content and manage system

2. **Owner verification:**
   ```python
   if memorial.user_id != current_user.id and not current_user.is_admin:
       raise HTTPException(status_code=403, detail="Not authorized")
   ```

3. **Admin-only endpoints:**
   ```python
   async def get_current_admin(
       current_user: User = Depends(get_current_user)
   ) -> User:
       if not current_user.is_admin:
           raise HTTPException(status_code=403)
       return current_user
   ```

### Data Protection

1. **Privacy masking:**
   - Mask email addresses in responses: `u***@example.com`
   - Don't expose internal IDs where not necessary
   - Limit response fields based on access level

2. **Sensitive data:**
   - Never log passwords or tokens
   - Never include in error messages
   - Use secure random generation for secrets

3. **CORS:**
   - Configure allowed origins explicitly
   - Never use `allow_origins=["*"]` in production
   - Set appropriate headers: credentials, methods, headers

4. **SQL Injection Prevention:**
   - Always use parameterized queries (built into SQLAlchemy ORM)
   - Never concatenate user input into SQL strings
   - Use ORM methods instead of raw SQL

### Input Validation

1. **Validate all inputs:**
   ```python
   from pydantic import BaseModel, EmailStr, Field
   
   class UserRegister(BaseModel):
       email: EmailStr
       password: str = Field(min_length=8, max_length=100)
   ```

2. **Use Pydantic validators:**
   ```python
   @field_validator('birth_date')
   @classmethod
   def validate_birth_date(cls, v):
       if v > date.today():
           raise ValueError('Birth date cannot be in future')
       return v
   ```

3. **Sanitize file uploads:**
   - Validate file type and size
   - Scan for malware (future requirement)
   - Store outside web root
   - Use random filenames

---

## Testing Requirements

### Mandatory Test Coverage

1. **Unit Tests (20+ tests):**
   - Validators (email, password, dates)
   - Security utilities (JWT, bcrypt)
   - Service business logic
   - Utility functions

2. **Integration Tests (40+ tests):**
   - All endpoints with various inputs
   - Error conditions and edge cases
   - Authorization checks
   - Database operations

3. **E2E Tests (future):**
   - Complete user workflows
   - Complex multi-step operations
   - Admin workflows

### Coverage Requirements

- **Minimum overall coverage:** 80%
- **Critical paths coverage:** 100% (auth, moderation, payment)
- **Controller/endpoint coverage:** 100%
- **Service layer coverage:** 95%+
- **Repository layer coverage:** 90%+

### Test Structure

```python
class TestAuthEndpoints:
    """Test authentication API endpoints."""
    
    @pytest.fixture
    def registered_user(self, client):
        """Setup registered user for tests."""
        
    def test_register_user_success(self, client):
        """Test successful user registration."""
        # Arrange
        payload = {"email": "user@example.com", "password": "SecurePass123!"}
        
        # Act
        response = client.post("/api/v1/auth/register", json=payload)
        
        # Assert
        assert response.status_code == 201
        assert response.json()["email"] == payload["email"]
    
    def test_register_duplicate_email(self, client, registered_user):
        """Test registration with existing email."""
        # Should fail with 400
```

### Testing Rules

1. **Each endpoint must have:**
   - Success case test
   - Failure case tests (4xx, 5xx)
   - Authorization test
   - Input validation test

2. **Test isolation:**
   - Fresh database per test
   - No test interdependencies
   - Clean up after test

3. **Fixtures:**
   - Use conftest.py for shared fixtures
   - Create factories for test data
   - Use dependency injection

4. **Naming convention:**
   - `test_<feature>_<scenario>`
   - `test_register_user_success`
   - `test_register_duplicate_email`

5. **Test database:**
   - Use in-memory SQLite for speed
   - Async support required
   - Auto-cleanup

### Pytest Configuration

```python
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
asyncio_mode = auto
addopts = -v --strict-markers --tb=short
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
```

---

## Documentation Requirements

### Code Documentation

1. **Module docstring:**
   ```python
   """
   Authentication service.
   
   Handles user registration, login, token generation, and JWT validation.
   """
   ```

2. **Function/method docstring:**
   ```python
   def create_access_token(
       data: dict,
       expires_delta: Optional[timedelta] = None
   ) -> str:
       """
       Generate JWT access token.
       
       Args:
           data: Claims to encode in token (typically {"sub": user_id})
           expires_delta: Token expiration time (default: 7 days)
       
       Returns:
           Encoded JWT token string
       
       Raises:
           ValueError: If data is empty
       
       Example:
           token = create_access_token({"sub": "user123"})
       """
   ```

3. **Class docstring:**
   ```python
   class UserService:
       """Service for user operations."""
       
       def __init__(self, db: AsyncSession):
           """Initialize with database session."""
   ```

### File Documentation

1. **README.md per major directory:**
   - Purpose of directory
   - Key modules and their purpose
   - Example usage
   - Common patterns

2. **Architecture Documentation:**
   - System design diagrams (ASCII or images)
   - Data flow diagrams
   - Sequence diagrams for complex flows

### API Documentation

1. **OpenAPI/Swagger:**
   - Automatically generated from FastAPI
   - Endpoint descriptions
   - Request/response examples
   - Error scenarios

2. **Manual documentation:**
   - Complex workflows documented separately
   - Best practices for API usage
   - Common patterns and examples

### Database Documentation

1. **Schema documentation:**
   - Table purposes
   - Column descriptions
   - Relationships explained
   - Constraints documented

2. **Migration documentation:**
   - Why the change was needed
   - What it affects
   - Rollback procedures

### Changelog

1. **CHANGELOG.md:**
   - Version number and date
   - Breaking changes
   - New features
   - Bug fixes
   - Dependency updates

### Comment Guidelines

1. **Avoid obvious comments:**
   ```python
   # Bad
   x = x + 1  # Increment x
   
   # Good
   user_count += 1  # Track active users for rate limiting
   ```

2. **Explain WHY, not WHAT:**
   ```python
   # Bad
   if user.is_pro:
       limit = 1000
   
   # Good
   if user.is_pro:
       limit = 1000  # Pro users get 10x higher rate limit per tier policy
   ```

3. **Complex logic needs comments:**
   ```python
   # JWT tokens use HS256 for symmetric signing to support stateless auth
   # Tokens expire in 7 days per security policy
   ```

---

## Code Quality Standards

### Style Guide

- **Language:** Python 3.10+
- **Formatter:** Black
- **Linter:** Flake8
- **Type checker:** Mypy
- **Max line length:** 100 characters

### Running Code Quality Tools

```bash
# Format code
black backend/

# Lint
flake8 backend/ --max-line-length=100

# Type checking
mypy backend/

# All together
black backend/ && flake8 backend/ && mypy backend/
```

### Type Hints

1. **Always use type hints:**
   ```python
   def get_user(user_id: UUID, db: AsyncSession) -> Optional[User]:
       """Get user by ID."""
   ```

2. **Use Union sparingly (use | operator in Python 3.10+):**
   ```python
   # Good (Python 3.10+)
   def process(data: dict | list) -> str:
       pass
   ```

3. **Use Optional explicitly:**
   ```python
   def get_optional(value: Optional[str] = None) -> None:
       pass
   ```

### Error Handling

1. **Catch specific exceptions:**
   ```python
   try:
       result = await db.execute(stmt)
   except SQLAlchemyError as e:
       logger.error(f"Database error: {e}")
       raise HTTPException(status_code=500)
   ```

2. **Custom exceptions:**
   ```python
   class MemorialNotFoundError(Exception):
       """Memorial with given ID not found."""
   ```

3. **Use HTTPException for API errors:**
   ```python
   raise HTTPException(
       status_code=400,
       detail="Invalid memorial dates"
   )
   ```

### Logging

1. **Use logging module:**
   ```python
   import logging
   
   logger = logging.getLogger(__name__)
   logger.info("User registered: %s", email)
   logger.error("Database connection failed: %s", str(e))
   ```

2. **Log levels:**
   - `DEBUG` - Detailed diagnostic information
   - `INFO` - Confirmations of successful operations
   - `WARNING` - Something unexpected but not critical
   - `ERROR` - Error that prevented a specific operation
   - `CRITICAL` - System-level error

3. **Never log sensitive data:**
   ```python
   # Bad
   logger.info(f"User login with password: {password}")
   
   # Good
   logger.info(f"User login: {user_id}")
   ```

### DRY Principle

1. **Extract common patterns:**
   - Validation logic → validators.py
   - Date handling → utils.py
   - Common queries → base repository

2. **Reusable components:**
   - Base classes (BaseRepository, BaseService)
   - Mixins for shared functionality
   - Utility functions

### SOLID Principles

1. **Single Responsibility:** Each class/function has one reason to change
2. **Open/Closed:** Open for extension, closed for modification
3. **Liskov Substitution:** Derived classes can substitute base classes
4. **Interface Segregation:** Clients shouldn't depend on unused interfaces
5. **Dependency Inversion:** Depend on abstractions, not concretions

---

## Git & Version Control

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Type:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Testing
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `chore` - Build/tooling

**Subject:**
- Imperative mood ("add feature", not "added feature")
- Don't capitalize first letter
- No period at end
- Max 50 characters

**Body:**
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

**Footer:**
- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: ...`

**Example:**
```
feat: add memorial search by name

Implement case-insensitive search on memorial names with pagination.
Adds search parameter to GET /api/v1/memorials endpoint.

Closes #456
```

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Testing improvements
- `refactor/description` - Code refactoring

### Pull Request Process

1. **Create feature branch** from `main`
2. **Write tests** before or alongside code
3. **Ensure all tests pass:** `pytest tests/ -v`
4. **Run code quality:** Black, Flake8, Mypy
5. **Update documentation** if needed
6. **Create PR with description**
7. **Code review by teammate**
8. **Squash and merge** to main

### Version Numbering

Use semantic versioning: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes

Example: `1.0.0` → `1.1.0` (new feature) → `1.1.1` (bug fix)

---

## Performance Guidelines

### Database Performance

1. **Indexes:**
   - Add indexes to columns used in WHERE clauses
   - Add indexes to foreign keys
   - Monitor slow queries

2. **Query optimization:**
   - Use eager loading for relationships
   - Avoid N+1 queries
   - Use pagination for large result sets
   - Select only needed columns

3. **Connection pooling:**
   - Keep pool size between 10-20 connections
   - Monitor connection usage
   - Set connection timeout appropriately

### API Performance

1. **Response time targets:**
   - Standard endpoints: < 100ms
   - Complex endpoints: < 500ms
   - File uploads: < 1s

2. **Caching:**
   - Cache static data (charities)
   - Cache user permissions
   - Use appropriate cache invalidation

3. **Pagination:**
   - Always paginate large result sets
   - Default 20 items, max 100
   - Use offset/limit pagination

### Code Performance

1. **Avoid:**
   - Blocking operations (use async)
   - Unnecessary database queries
   - Large data structures in memory
   - Synchronous file operations

2. **Optimize:**
   - Use generators for large datasets
   - Lazy load relationships
   - Batch operations when possible
   - Use appropriate data structures

### Monitoring

1. **Metrics to track:**
   - API response times (by endpoint)
   - Database query times
   - Error rates
   - Request volume

2. **Alerts:**
   - Response time > 1s
   - Error rate > 1%
   - Database connection pool exhaustion

---

## Naming Conventions

### Python Naming

```python
# Modules: lowercase with underscores
auth.py
user_repository.py

# Classes: PascalCase
class UserService:
    pass

class MemorialRepository:
    pass

# Functions/methods: lowercase with underscores
def create_access_token():
    pass

def validate_email():
    pass

# Constants: UPPER_CASE
MAX_IMAGE_SIZE = 5_000_000  # 5MB
TOKEN_EXPIRATION_DAYS = 7

# Private: leading underscore
def _internal_helper():
    pass

# Protected: leading underscore (Python convention)
def _protected_method(self):
    pass

# Dunder: leading and trailing double underscore (special)
def __init__(self):
    pass
```

### Database Naming

```sql
-- Tables: lowercase plural
users
memorials
memorial_images
comments

-- Columns: lowercase with underscores
user_id
birth_date
created_at
is_active

-- Foreign keys: {table}_id
user_id
memorial_id

-- Indexes: idx_{table}_{column}
idx_user_email
idx_memorial_status
idx_memorial_user_id

-- Constraints:
uq_user_email  -- Unique
ck_memorial_dates  -- Check
fk_memorial_user_id  -- Foreign key
```

### API Naming

```
# Endpoints: lowercase, plural nouns
/api/v1/users
/api/v1/memorials
/api/v1/comments

# Query parameters: lowercase, camelCase for compound
?page=1
?pageSize=20
?sortBy=created_at
?orderBy=desc
?searchTerm=john

# Response fields: camelCase
{
  "userId": "uuid",
  "firstName": "John",
  "createdAt": "2024-01-28T10:00:00Z"
}

# Headers: Title-Case
Content-Type: application/json
Authorization: Bearer token
X-Request-ID: uuid
```

### File Naming

```
# Test files: test_{module}.py
test_auth.py
test_memorial_service.py

# Route files: {resource}.py
auth.py
memorials.py
comments.py

# Schema files: {resource}.py
auth.py
memorial.py

# Service files: {resource}.py
auth_service.py
memorial_service.py
```

---

## Checklist for New Features

Before submitting a feature, ensure:

### Code
- [ ] Code follows Black formatting
- [ ] Passes Flake8 linting
- [ ] Passes Mypy type checking
- [ ] All type hints added
- [ ] Code is DRY (no duplication)
- [ ] SOLID principles followed

### Testing
- [ ] Unit tests written (80%+ coverage)
- [ ] Integration tests for endpoints
- [ ] All tests passing locally
- [ ] Edge cases covered
- [ ] Error conditions tested

### Documentation
- [ ] Code comments added for complex logic
- [ ] Function docstrings complete
- [ ] README updated if needed
- [ ] API documentation accurate
- [ ] Database schema documented

### Git
- [ ] Feature branch created
- [ ] Commits with clear messages
- [ ] PR description complete
- [ ] No merge conflicts
- [ ] Ready for code review

### Performance
- [ ] No N+1 queries
- [ ] Indexes added for new queries
- [ ] Response time acceptable
- [ ] No unnecessary data transfers

### Security
- [ ] Input validation on all fields
- [ ] Authorization checks in place
- [ ] No sensitive data logging
- [ ] Passwords hashed
- [ ] Tokens properly validated

---

## When Implementing New Endpoints

1. **Create schema** with Pydantic validation
2. **Add database model** if needed
3. **Add repository method** for data access
4. **Add service method** for business logic
5. **Add endpoint** with proper decorators
6. **Add dependency** injection for auth
7. **Write tests** for success and failure cases
8. **Update API docs** with endpoint description
9. **Test manually** with curl/Postman
10. **Update CHANGELOG.md**

---

## When Modifying Database Schema

1. **Create Alembic migration**: `alembic revision --autogenerate -m "description"`
2. **Review migration** before committing
3. **Test on local database** first
4. **Write tests** for schema changes
5. **Update models** and schemas
6. **Document migration** in CHANGELOG
7. **Consider migration time** for large tables

---

## When Fixing Bugs

1. **Write failing test** that reproduces bug
2. **Fix the bug** with minimal changes
3. **Ensure test passes**
4. **Check for similar bugs** elsewhere
5. **Add regression test** if needed
6. **Commit with `fix:` prefix**
7. **Update CHANGELOG.md**

---

## Review Criteria

All code must meet these criteria before merging:

- ✅ All tests pass
- ✅ Code quality tools pass (Black, Flake8, Mypy)
- ✅ Test coverage maintained/improved
- ✅ Documentation complete
- ✅ No breaking changes (or clearly documented)
- ✅ Performance acceptable
- ✅ Security reviewed
- ✅ At least one approval

---

## Continuous Integration/Deployment

### Pre-commit Checks
```bash
pytest tests/ -v
black backend/ --check
flake8 backend/
mypy backend/
```

### Before Push
```bash
# Format
black backend/

# Lint
flake8 backend/

# Type check
mypy backend/

# Test
pytest tests/ -v --cov=backend/app
```

### Deployment Pipeline
1. **Lint & Type Check** - Must pass
2. **Run Tests** - Must pass with 80%+ coverage
3. **Build Docker Image** - Must succeed
4. **Push to Registry** - On main branch only
5. **Deploy to Staging** - Automated
6. **Smoke Tests** - Verify basic functionality
7. **Deploy to Production** - Manual approval

---

## Summary

This document defines the standards for Memorial Bridge development. All team members must:

1. ✅ Follow the architecture and layering
2. ✅ Write comprehensive tests (80%+ coverage)
3. ✅ Document code and changes
4. ✅ Follow naming and coding conventions
5. ✅ Maintain security and performance
6. ✅ Use proper git practices
7. ✅ Pass code quality checks
8. ✅ Get code reviewed before merging

**When in doubt, refer to existing code or this document.**

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0  
**Status:** Active
