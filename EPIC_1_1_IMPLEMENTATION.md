# Epic 1.1 Implementation: Authentication & User Management

**Status:** ✅ Complete  
**Story Points:** 5  
**Completion Date:** January 28, 2026

---

## Overview

Epic 1.1 implements the foundational authentication and user management system for Memorial Bridge. This epic enables users to create accounts, securely authenticate, and maintain sessions via JWT tokens.

---

## Features Implemented

### 1. User Registration
**Endpoint:** `POST /api/v1/auth/register`  
**Status:** ✅ Implemented

**Functionality:**
- Email/password signup form submission
- Email format validation (RFC 5322 pattern)
- Password strength validation with specific requirements
- Password confirmation matching
- Duplicate email prevention (unique constraint)
- Bcrypt password hashing with automatic salting
- User creation with default roles (is_pro=false, is_admin=false)
- Automatic timestamps (created_at, updated_at)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Cases:**
- `400 Bad Request`: Invalid email format
- `400 Bad Request`: Email already registered
- `400 Bad Request`: Passwords don't match
- `400 Bad Request`: Password doesn't meet strength requirements

**Validation Rules:**
- Email: Valid format with @ and domain
- Password minimum 8 characters
- Password requires at least 1 uppercase letter (A-Z)
- Password requires at least 1 lowercase letter (a-z)
- Password requires at least 1 number (0-9)
- Password requires at least 1 special character (!@#$%^&*...)

### 2. User Login
**Endpoint:** `POST /api/v1/auth/login`  
**Status:** ✅ Implemented

**Functionality:**
- Email/password authentication
- Credential validation against database
- JWT token generation on successful login
- 7-day token expiration
- User profile data in response
- Last login timestamp update
- Invalid credentials rejected securely

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "is_pro": false,
    "is_admin": false,
    "created_at": "2026-01-28T12:00:00+00:00"
  }
}
```

**Error Cases:**
- `401 Unauthorized`: Invalid email or password
- `401 Unauthorized`: User account not found

**Token Structure:**
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

**Token Expiration:** 7 days from creation

### 3. User Logout
**Endpoint:** `POST /api/v1/auth/logout`  
**Status:** ✅ Implemented

**Functionality:**
- Endpoint for logout confirmation
- Client-side token removal (localStorage/sessionStorage)
- Graceful response regardless of token state

**Request Header:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Note:** Token revocation happens on client-side; server maintains stateless JWT validation.

### 4. Get Current User
**Endpoint:** `GET /api/v1/auth/me`  
**Status:** ✅ Implemented

**Functionality:**
- Retrieve current user profile
- JWT authentication required
- User info includes role information
- Verify token validity
- Return full user object

**Request Header:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "is_pro": false,
  "is_admin": false,
  "created_at": "2026-01-28T12:00:00+00:00"
}
```

**Error Cases:**
- `401 Unauthorized`: Missing authorization header
- `401 Unauthorized`: Invalid or expired token
- `401 Unauthorized`: User not found in database

---

## Technical Architecture

### Security Implementation

**Password Hashing:**
- Algorithm: Bcrypt with SHA-256
- Library: `passlib[bcrypt]`
- Automatic salt generation
- Hash verification using time-constant comparison

**JWT Tokens:**
- Algorithm: HS256 (HMAC with SHA-256)
- Library: `python-jose[cryptography]`
- Secret key from environment configuration
- Expiration enforced at validation
- Claims structure: sub, email, is_pro, is_admin, exp, iat

**Authentication Scheme:**
- HTTP Bearer tokens
- Authorization header: `Bearer <token>`
- `fastapi-security` HTTPBearer implementation

### Dependency Injection

**get_current_user():**
- Validates Bearer token
- Decodes JWT payload
- Retrieves user from database
- Returns User model instance
- Used with `Depends()` in endpoints

**get_current_admin():**
- Wraps get_current_user()
- Checks is_admin flag
- Returns error if not admin
- Used for admin-only endpoints

### Database Layer

**User Model:**
```python
class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_pro = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=current_utc_time)
    updated_at = Column(DateTime(timezone=True), onupdate=current_utc_time)
    last_login = Column(DateTime(timezone=True), nullable=True)
```

**Indexes:**
- email: For fast login lookups
- is_admin: For admin queries

**Repository Pattern:**
- `UserRepository` class for data access
- Methods: `create()`, `get()`, `get_by_email()`, `email_exists()`
- Async operations via SQLAlchemy asyncio

### Service Layer

**AuthService:**
- Business logic for authentication
- Password validation orchestration
- User creation with error handling
- Login flow with token generation
- User retrieval by ID

---

## API Integration

### Base URL
```
http://localhost:8000/api/v1
```

### CORS Configuration
- Allow all origins (development mode)
- Credentials supported
- All HTTP methods allowed
- All headers allowed

### Error Response Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Success Response Format
```json
{
  "data": {...},
  "message": "Success message"
}
```

---

## Configuration

**Environment Variables:**
```bash
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/memorialbridge
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
ENVIRONMENT=development
DEBUG=true
```

**Security Configuration:**
- SECRET_KEY: Used for JWT signing (must be > 32 characters in production)
- ALGORITHM: HS256 for symmetric key signing
- ACCESS_TOKEN_EXPIRE_DAYS: 7 days (can be configured)

---

## Testing Checklist

**Unit Tests:**
- [ ] Password validation: minimum length requirement
- [ ] Password validation: requires uppercase letter
- [ ] Password validation: requires lowercase letter
- [ ] Password validation: requires number
- [ ] Password validation: requires special character
- [ ] Email validation: accepts valid formats
- [ ] Email validation: rejects invalid formats
- [ ] Email validation: case-insensitive storage
- [ ] Password hashing: produces unique hashes for same password
- [ ] Token generation: includes correct claims
- [ ] Token generation: has correct expiration
- [ ] Token decoding: validates signature
- [ ] Token decoding: rejects expired tokens
- [ ] Token decoding: rejects invalid tokens

**Integration Tests:**
- [ ] Registration with valid data creates user
- [ ] Registration with duplicate email fails
- [ ] Registration with weak password fails
- [ ] Registration with mismatched passwords fails
- [ ] Registration with invalid email format fails
- [ ] Login with valid credentials returns token
- [ ] Login with invalid password fails
- [ ] Login with non-existent email fails
- [ ] Get user endpoint returns current user
- [ ] Get user endpoint fails without token
- [ ] Get user endpoint fails with invalid token
- [ ] Logout endpoint returns success
- [ ] Token expiration is enforced

**E2E Tests:**
- [ ] Complete signup → login → get user → logout flow
- [ ] Multiple users can register independently
- [ ] User can login multiple times
- [ ] Tokens from different users are independent

---

## Known Limitations & Future Work

**Current Limitations:**
- No password reset functionality
- No email verification required
- No rate limiting on auth endpoints
- No account lockout after failed attempts
- Tokens are stateless (no server-side blacklist)
- No refresh token implementation

**Future Enhancements (Post-M1):**
- Password reset via email
- Email verification on signup
- Rate limiting (e.g., 5 login attempts per 15 minutes)
- Account lockout after N failed attempts
- Refresh token rotation
- Multi-factor authentication
- Social login (Google, Facebook)
- Session management with refresh tokens
- HTTPS enforcement in production

---

## Deployment Notes

**Database Migration:**
```bash
alembic upgrade head
```

**Environment Setup:**
- Set `SECRET_KEY` to secure random value
- Set `DATABASE_URL` to production database
- Set `ENVIRONMENT=production`
- Set `DEBUG=false`
- Enable HTTPS

**Security Checklist:**
- [ ] SECRET_KEY is strong (> 32 characters, random)
- [ ] Database credentials are secure
- [ ] HTTPS enforced in production
- [ ] CORS origins restricted to known domains
- [ ] Rate limiting configured
- [ ] Logging configured for auth failures

---

## Files Modified/Created

**Backend Files:**
- `app/core/config.py`: Configuration management
- `app/core/security.py`: Password hashing and JWT operations
- `app/core/validators.py`: Email and password validation
- `app/models/__init__.py`: User model definition
- `app/schemas/auth.py`: Request/response schemas
- `app/repositories/user.py`: User data access layer
- `app/services/__init__.py` (auth service): Authentication business logic
- `app/api/dependencies.py`: Dependency injection for auth
- `app/api/v1/endpoints/auth.py`: Auth route handlers
- `app/db/session.py`: Database connection management

**Configuration:**
- `.env.example`: Environment variables template
- `requirements.txt`: Python dependencies

---

## Code Examples

### Register a User (Frontend)
```javascript
const response = await fetch('http://localhost:8000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
    password_confirm: 'SecurePassword123!'
  })
});
const data = await response.json();
console.log(data.user_id);
```

### Login User (Frontend)
```javascript
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!'
  })
});
const data = await response.json();
localStorage.setItem('token', data.access_token);
```

### Get Current User (Frontend)
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const user = await response.json();
console.log(user.email);
```

---

## Validation Examples

**Valid Passwords:**
- `SecurePass123!` ✅
- `MyMemorial@2026` ✅
- `Correct#Horse123` ✅

**Invalid Passwords:**
- `short` ❌ (too short)
- `nouppercase123!` ❌ (no uppercase)
- `NOLOWERCASE123!` ❌ (no lowercase)
- `NoNumbers!` ❌ (no number)
- `NoSpecial123` ❌ (no special char)

---

## References

- JWT.io: https://jwt.io/
- Bcrypt: https://github.com/pyca/bcrypt
- OWASP Password Guidelines: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
