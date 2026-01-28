# Memorial Bridge - Project Runbook
## Single Source of Truth for Full-Stack Application Development

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** MVP Development Phase

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Schema](#3-database-schema)
4. [Backend API Design (FastAPI)](#4-backend-api-design-fastapi)
5. [Frontend Architecture (React)](#5-frontend-architecture-react)
6. [Security Specifications](#6-security-specifications)
7. [Design System & Visual Language](#7-design-system--visual-language)
8. [Feature Specifications](#8-feature-specifications)
9. [Development Guidelines](#9-development-guidelines)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Testing Strategy](#11-testing-strategy)
12. [Accessibility & Internationalization](#12-accessibility--internationalization)
13. [Project Structure](#13-project-structure)

---

## 1. Project Overview

### 1.1 Mission Statement
Memorial Bridge is a respectful global platform where users can create memorial pages for loved ones and connect those memories to charitable causes.

**Tagline:** "Preserve Memories. Inspire Legacy."

### 1.2 Core Objectives
- Provide a free, respectful, and open platform for memorial creation
- Enable users to honor loved ones with stories, photos, and tributes
- Connect memorials to charitable causes to inspire legacy
- Maintain a safe, empathetic, and culturally sensitive environment
- Build a scalable foundation for future expansion

### 1.3 MVP Scope
The MVP focuses on core functionality:
- User authentication and authorization
- Memorial creation and management
- Public/private memorial viewing
- Comment system with moderation
- Pro plan subscription (mocked for MVP)
- Charity association with memorials
- Admin dashboard for content moderation

### 1.4 Out of Scope (MVP)
- Real payment processing
- Mobile native apps (architecture ready for React Native)
- Group-based memorial management
- Advanced analytics
- Email notifications
- Social media integration (beyond links in footer)

---

## 2. Architecture Overview

### 2.1 Technology Stack

#### Backend
- **Framework:** Python FastAPI 0.104+
- **Database:** PostgreSQL 14+
- **ORM:** SQLAlchemy 2.0+ (async)
- **Authentication:** JWT (python-jose), bcrypt for password hashing
- **File Storage:** Local filesystem (dev), S3-compatible storage (production)
- **Validation:** Pydantic v2
- **Testing:** pytest, pytest-asyncio, httpx

#### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **State Management:** React Query (TanStack Query) + Context API
- **Routing:** React Router v6
- **UI Components:** Custom components following design system
- **Form Handling:** React Hook Form + Zod validation
- **HTTP Client:** Axios or Fetch API
- **Styling:** CSS Modules / Tailwind CSS (following design system)
- **Testing:** Vitest, React Testing Library

#### Infrastructure
- **Development:** Docker & Docker Compose
- **Hosting:** Replit-compatible / Low-cost deployment platforms
- **CI/CD:** GitHub Actions (optional for MVP)
- **Monitoring:** Basic logging (structured logging with Python logging)

### 2.2 Architecture Patterns

#### Backend Patterns
- **Layered Architecture:**
  - API Routes (FastAPI routers)
  - Service Layer (business logic)
  - Repository Layer (data access)
  - Models (SQLAlchemy ORM)
- **Dependency Injection:** FastAPI's dependency system
- **Async/Await:** Full async support for I/O operations
- **Error Handling:** Centralized exception handlers

#### Frontend Patterns
- **Component-Based Architecture:** Reusable, composable components
- **Container/Presentational Pattern:** Separation of logic and presentation
- **Custom Hooks:** Reusable business logic
- **API Client Layer:** Centralized API calls with React Query

### 2.3 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Public  │  │  User   │  │  Admin   │  │  Auth    │   │
│  │  Pages   │  │  Pages  │  │ Dashboard│  │  Pages   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS/REST API
┌───────────────────────┴─────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Memorial │  │ Comment  │  │  Admin   │   │
│  │  Router  │  │  Router  │  │  Router  │  │  Router  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Memorial │  │ Comment  │  │  Charity │   │
│  │ Service │  │ Service  │  │ Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   User  │  │ Memorial │  │ Comment  │                  │
│  │Repository│ │Repository│ │Repository│                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌─────────▼────────┐
│  PostgreSQL    │            │  File Storage     │
│   Database     │            │  (Local/S3)       │
└────────────────┘            └──────────────────┘
```

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    Users    │         │   Memorials  │         │  Comments   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │◄──┐     │ id (PK)      │◄──┐     │ id (PK)     │
│ email       │   │     │ user_id (FK) │   │     │ memorial_id │
│ password    │   │     │ full_name    │   │     │ user_id (FK)│
│ is_pro      │   │     │ birth_date   │   │     │ content     │
│ is_admin    │   │     │ death_date   │   │     │ image_url   │
│ created_at  │   │     │ story        │   │     │ is_flagged  │
│ updated_at  │   │     │ privacy      │   │     │ created_at  │
└─────────────┘   │     │ status       │   │     │ updated_at  │
                  │     │ created_at   │   │     └─────────────┘
                  │     │ updated_at   │   │
                  │     └──────────────┘   │
                  │            │            │
                  │            │            │
                  │     ┌──────▼──────┐    │
                  │     │Memorial_Images│   │
                  │     ├─────────────┤    │
                  │     │ id (PK)     │    │
                  │     │ memorial_id │    │
                  │     │ image_url   │    │
                  │     │ order       │    │
                  │     └─────────────┘    │
                  │                        │
                  │     ┌──────────────┐   │
                  │     │Memorial_Charities│
                  │     ├──────────────┤   │
                  │     │ memorial_id  │   │
                  │     │ charity_id   │   │
                  │     └──────────────┘   │
                  │                        │
                  └────────────────────────┘
                           │
                  ┌────────▼────────┐
                  │    Charities     │
                  ├──────────────────┤
                  │ id (PK)          │
                  │ name             │
                  │ description      │
                  │ url              │
                  │ created_at       │
                  │ updated_at       │
                  └──────────────────┘
```

### 3.2 Table Definitions

#### 3.2.1 Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_pro BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_admin ON users(is_admin);
```

#### 3.2.2 Memorials Table
```sql
CREATE TABLE memorials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    death_date DATE,
    story TEXT,
    privacy VARCHAR(20) NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'link-only')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    CONSTRAINT valid_dates CHECK (death_date IS NULL OR birth_date IS NULL OR death_date >= birth_date)
);

CREATE INDEX idx_memorials_user_id ON memorials(user_id);
CREATE INDEX idx_memorials_status ON memorials(status);
CREATE INDEX idx_memorials_privacy_status ON memorials(privacy, status);
CREATE INDEX idx_memorials_created_at ON memorials(created_at DESC);
```

#### 3.2.3 Memorial Images Table
```sql
CREATE TABLE memorial_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_order INTEGER NOT NULL CHECK (image_order >= 1 AND image_order <= 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(memorial_id, image_order)
);

CREATE INDEX idx_memorial_images_memorial_id ON memorial_images(memorial_id);
```

#### 3.2.4 Comments Table
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE INDEX idx_comments_memorial_id ON comments(memorial_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_is_flagged ON comments(is_flagged);
CREATE INDEX idx_comments_user_memorial ON comments(user_id, memorial_id);
```

#### 3.2.5 Charities Table
```sql
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT url_format CHECK (url ~* '^https?://')
);

CREATE INDEX idx_charities_is_active ON charities(is_active);
```

#### 3.2.6 Memorial Charities Junction Table
```sql
CREATE TABLE memorial_charities (
    memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
    charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (memorial_id, charity_id)
);

CREATE INDEX idx_memorial_charities_memorial_id ON memorial_charities(memorial_id);
CREATE INDEX idx_memorial_charities_charity_id ON memorial_charities(charity_id);
```

### 3.3 Database Constraints & Rules

#### Business Rules
1. **Memorial Images:** Maximum 2 images per memorial (enforced by `image_order` constraint)
2. **Comment Images:** Pro users can have up to 5 image comments per memorial (application-level check)
3. **Privacy:** Link-only memorials are not included in public listings (application-level filter)
4. **Status Workflow:** Memorials start as 'pending', can be 'approved' or 'rejected' by admin
5. **Date Validation:** Death date must be >= birth date if both provided

#### Indexes Strategy
- Primary keys automatically indexed
- Foreign keys indexed for join performance
- Composite indexes for common query patterns
- Status/privacy indexes for filtering
- Created_at indexes for chronological ordering

---

## 4. Backend API Design (FastAPI)

### 4.1 API Structure

#### Base URL Structure
```
/api/v1/
├── /auth          # Authentication endpoints
├── /memorials     # Memorial CRUD operations
├── /comments      # Comment operations
├── /charities     # Charity management
└── /admin         # Admin operations
```

### 4.2 Authentication Endpoints

#### POST /api/v1/auth/register
**Description:** User registration  
**Authentication:** None  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!"
}
```
**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user_id": "uuid"
}
```
**Validation:**
- Email format validation
- Password strength: min 8 chars, at least one uppercase, lowercase, number, special char
- Password confirmation match

#### POST /api/v1/auth/login
**Description:** User login  
**Authentication:** None  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
**Response:** `200 OK`
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "is_pro": false,
    "is_admin": false
  }
}
```

#### POST /api/v1/auth/logout
**Description:** Logout (client-side token removal, optional server-side blacklist)  
**Authentication:** Required (JWT)  
**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

#### GET /api/v1/auth/me
**Description:** Get current user info  
**Authentication:** Required (JWT)  
**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "is_pro": false,
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 4.3 Memorial Endpoints

#### GET /api/v1/memorials
**Description:** List public approved memorials  
**Authentication:** None  
**Query Parameters:**
- `page`: int (default: 1)
- `limit`: int (default: 20, max: 100)
- `search`: string (optional, search by name)
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "birth_date": "1980-01-01",
      "death_date": "2022-12-31",
      "story": "Short tribute...",
      "privacy": "public",
      "images": ["url1", "url2"],
      "charities": [
        {"id": "uuid", "name": "Charity Name", "url": "https://..."}
      ],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

#### GET /api/v1/memorials/{memorial_id}
**Description:** Get single memorial (public or link-only)  
**Authentication:** None (for public/link-only)  
**Response:** `200 OK`
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "birth_date": "1980-01-01",
  "death_date": "2022-12-31",
  "story": "Full tribute text...",
  "privacy": "public",
  "images": [
    {"id": "uuid", "url": "url1", "order": 1},
    {"id": "uuid", "url": "url2", "order": 2}
  ],
  "charities": [
    {"id": "uuid", "name": "Charity Name", "description": "...", "url": "https://..."}
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /api/v1/memorials
**Description:** Create new memorial  
**Authentication:** Required (JWT)  
**Request:** `multipart/form-data`
```
full_name: string (required)
birth_date: date (optional, YYYY-MM-DD)
death_date: date (optional, YYYY-MM-DD)
story: string (optional)
privacy: "public" | "link-only" (required)
charity_ids: array of UUIDs (optional)
images: file[] (max 2 files, max 5MB each, jpg/png/webp)
```
**Response:** `201 Created`
```json
{
  "id": "uuid",
  "message": "Memorial created successfully. It is pending approval.",
  "status": "pending"
}
```

#### PUT /api/v1/memorials/{memorial_id}
**Description:** Update memorial (only by creator)  
**Authentication:** Required (JWT, must be creator)  
**Request:** Same as POST  
**Response:** `200 OK`
```json
{
  "id": "uuid",
  "message": "Memorial updated successfully",
  "status": "pending" // Resets to pending if changed
}
```

#### DELETE /api/v1/memorials/{memorial_id}
**Description:** Delete memorial (only by creator or admin)  
**Authentication:** Required (JWT, creator or admin)  
**Response:** `200 OK`
```json
{
  "message": "Memorial deleted successfully"
}
```

#### GET /api/v1/memorials/my
**Description:** Get current user's memorials  
**Authentication:** Required (JWT)  
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "status": "pending",
      "privacy": "public",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 4.4 Comment Endpoints

#### GET /api/v1/memorials/{memorial_id}/comments
**Description:** Get comments for a memorial  
**Authentication:** None  
**Query Parameters:**
- `page`: int (default: 1)
- `limit`: int (default: 50)
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_email": "user@example.com", // Masked email
      "content": "Comment text",
      "image_url": "url" | null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1
}
```

#### POST /api/v1/memorials/{memorial_id}/comments
**Description:** Create comment  
**Authentication:** Required (JWT)  
**Request:** `multipart/form-data`
```
content: string (required)
image: file (optional, only for Pro users, max 5MB, jpg/png/webp)
```
**Response:** `201 Created`
```json
{
  "id": "uuid",
  "content": "Comment text",
  "image_url": "url" | null,
  "created_at": "2024-01-01T00:00:00Z"
}
```
**Business Rules:**
- Free users: text-only comments
- Pro users: can include images (max 5 image comments per memorial per user)
- Auto-filter profanity

#### DELETE /api/v1/comments/{comment_id}
**Description:** Delete comment (by creator or admin)  
**Authentication:** Required (JWT, creator or admin)  
**Response:** `200 OK`
```json
{
  "message": "Comment deleted successfully"
}
```

#### POST /api/v1/comments/{comment_id}/report
**Description:** Report inappropriate comment  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```
**Response:** `200 OK`
```json
{
  "message": "Comment reported. Thank you for helping maintain a respectful community."
}
```

#### GET /api/v1/memorials/{memorial_id}/comments/image-count
**Description:** Get image comment count for current user (Pro users)  
**Authentication:** Required (JWT)  
**Response:** `200 OK`
```json
{
  "count": 3,
  "limit": 5,
  "remaining": 2
}
```

### 4.5 Charity Endpoints

#### GET /api/v1/charities
**Description:** List active charities  
**Authentication:** None  
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Charity Name",
      "description": "Mission statement...",
      "url": "https://charity.org"
    }
  ]
}
```

### 4.6 Admin Endpoints

#### GET /api/v1/admin/memorials/pending
**Description:** List pending memorials for review  
**Authentication:** Required (JWT, admin only)  
**Query Parameters:**
- `page`: int (default: 1)
- `limit`: int (default: 20)
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "user_id": "uuid",
      "user_email": "creator@example.com",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

#### POST /api/v1/admin/memorials/{memorial_id}/approve
**Description:** Approve memorial  
**Authentication:** Required (JWT, admin only)  
**Response:** `200 OK`
```json
{
  "message": "Memorial approved successfully",
  "memorial_id": "uuid"
}
```

#### POST /api/v1/admin/memorials/{memorial_id}/reject
**Description:** Reject memorial  
**Authentication:** Required (JWT, admin only)  
**Request Body:**
```json
{
  "reason": "Optional rejection reason"
}
```
**Response:** `200 OK`
```json
{
  "message": "Memorial rejected",
  "memorial_id": "uuid"
}
```

#### GET /api/v1/admin/comments/flagged
**Description:** List flagged comments  
**Authentication:** Required (JWT, admin only)  
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "memorial_id": "uuid",
      "user_id": "uuid",
      "content": "Comment text",
      "is_flagged": true,
      "flagged_reason": "Reported by users",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/v1/admin/users
**Description:** List users (with Pro status)  
**Authentication:** Required (JWT, admin only)  
**Query Parameters:**
- `page`: int (default: 1)
- `limit`: int (default: 50)
**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "is_pro": false,
      "is_admin": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### PATCH /api/v1/admin/users/{user_id}/pro-status
**Description:** Toggle user Pro status (MVP: manual toggle)  
**Authentication:** Required (JWT, admin only)  
**Request Body:**
```json
{
  "is_pro": true
}
```
**Response:** `200 OK`
```json
{
  "message": "User Pro status updated",
  "user_id": "uuid",
  "is_pro": true
}
```

#### POST /api/v1/admin/charities
**Description:** Create charity  
**Authentication:** Required (JWT, admin only)  
**Request Body:**
```json
{
  "name": "Charity Name",
  "description": "Mission statement",
  "url": "https://charity.org"
}
```
**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Charity Name",
  "description": "Mission statement",
  "url": "https://charity.org"
}
```

#### PUT /api/v1/admin/charities/{charity_id}
**Description:** Update charity  
**Authentication:** Required (JWT, admin only)  
**Request Body:** Same as POST  
**Response:** `200 OK`

#### DELETE /api/v1/admin/charities/{charity_id}
**Description:** Delete charity (soft delete: set is_active=false)  
**Authentication:** Required (JWT, admin only)  
**Response:** `200 OK`

### 4.7 Error Responses

All endpoints return consistent error format:

**400 Bad Request:**
```json
{
  "detail": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "detail": "Not authenticated"
}
```

**403 Forbidden:**
```json
{
  "detail": "Not enough permissions"
}
```

**404 Not Found:**
```json
{
  "detail": "Resource not found"
}
```

**422 Unprocessable Entity:**
```json
{
  "detail": "Business rule violation",
  "message": "You have reached the maximum of 5 image comments for this memorial"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

### 4.8 Request/Response Models (Pydantic)

#### User Models
```python
class UserCreate(BaseModel):
    email: EmailStr
    password: str  # Min 8 chars, validated
    password_confirm: str

class UserResponse(BaseModel):
    id: UUID
    email: str
    is_pro: bool
    is_admin: bool
    created_at: datetime
```

#### Memorial Models
```python
class MemorialCreate(BaseModel):
    full_name: str  # Min 1 char, max 255
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    story: Optional[str] = None  # Max 10000 chars
    privacy: Literal["public", "link-only"]
    charity_ids: List[UUID] = []

class MemorialResponse(BaseModel):
    id: UUID
    full_name: str
    birth_date: Optional[date]
    death_date: Optional[date]
    story: Optional[str]
    privacy: str
    status: str
    images: List[ImageResponse]
    charities: List[CharityResponse]
    created_at: datetime
```

#### Comment Models
```python
class CommentCreate(BaseModel):
    content: str  # Min 1 char, max 5000
    image: Optional[UploadFile] = None  # Only for Pro users

class CommentResponse(BaseModel):
    id: UUID
    user_id: UUID
    user_email: str  # Masked: "u***@example.com"
    content: str
    image_url: Optional[str]
    created_at: datetime
```

### 4.9 File Upload Specifications

#### Image Requirements
- **Formats:** JPEG, PNG, WebP
- **Max Size:** 5MB per file
- **Memorial Images:** Max 2 files
- **Comment Images:** Max 1 file per comment (Pro users only)
- **Validation:** MIME type + file extension + file signature
- **Storage:** 
  - Development: `/uploads/memorials/` and `/uploads/comments/`
  - Production: S3-compatible storage with CDN

#### Image Processing
- Resize large images (max dimension 2000px)
- Generate thumbnails (300x300px for listings)
- Optimize file size (JPEG quality 85%)
- Store original + thumbnail URLs

---

## 5. Frontend Architecture (React)

### 5.1 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── memorial/        # Memorial-specific components
│   │   │   ├── MemorialCard.tsx
│   │   │   ├── MemorialForm.tsx
│   │   │   ├── MemorialDetail.tsx
│   │   │   └── ImageUpload.tsx
│   │   ├── comment/         # Comment components
│   │   │   ├── CommentList.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   └── CommentItem.tsx
│   │   └── admin/           # Admin components
│   │       ├── AdminDashboard.tsx
│   │       ├── PendingMemorials.tsx
│   │       └── UserManagement.tsx
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── MemorialCreatePage.tsx
│   │   ├── MemorialDetailPage.tsx
│   │   ├── MemorialListPage.tsx
│   │   └── AdminDashboardPage.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useMemorials.ts
│   │   ├── useComments.ts
│   │   └── useImageUpload.ts
│   ├── services/            # API client layer
│   │   ├── api.ts           # Axios instance & interceptors
│   │   ├── auth.ts
│   │   ├── memorials.ts
│   │   ├── comments.ts
│   │   └── charities.ts
│   ├── store/               # State management
│   │   ├── authContext.tsx
│   │   └── themeContext.tsx
│   ├── utils/               # Utility functions
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── profanityFilter.ts
│   ├── styles/              # Global styles
│   │   ├── variables.css    # CSS variables (colors, fonts)
│   │   ├── base.css         # Reset & base styles
│   │   └── components.css   # Component styles
│   ├── types/               # TypeScript types
│   │   ├── user.ts
│   │   ├── memorial.ts
│   │   ├── comment.ts
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx            # React Router configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js       # If using Tailwind
```

### 5.2 Component Architecture

#### 5.2.1 Component Hierarchy

```
App
├── Router
│   ├── Public Routes
│   │   ├── HomePage
│   │   │   ├── HeroSection
│   │   │   ├── FeaturesSection
│   │   │   └── MemorialPreviewSection
│   │   ├── MemorialListPage
│   │   │   └── MemorialCard[]
│   │   └── MemorialDetailPage
│   │       ├── MemorialDetail
│   │       ├── CommentList
│   │       └── CommentForm
│   ├── Auth Routes
│   │   ├── LoginPage
│   │   └── RegisterPage
│   ├── Protected Routes
│   │   ├── MemorialCreatePage
│   │   │   └── MemorialForm
│   │   └── MyMemorialsPage
│   └── Admin Routes
│       └── AdminDashboardPage
│           ├── PendingMemorials
│           ├── UserManagement
│           └── CharityManagement
└── Layout Components
    ├── Header
    └── Footer
```

### 5.3 State Management Strategy

#### 5.3.1 React Query (TanStack Query)
**Purpose:** Server state management, caching, synchronization

**Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Usage Examples:**
```typescript
// Fetch memorials
const { data, isLoading, error } = useQuery({
  queryKey: ['memorials', page],
  queryFn: () => memorialsService.getMemorials(page),
});

// Create memorial
const mutation = useMutation({
  mutationFn: memorialsService.createMemorial,
  onSuccess: () => {
    queryClient.invalidateQueries(['memorials']);
  },
});
```

#### 5.3.2 Context API
**Purpose:** Global client state (auth, theme)

**Auth Context:**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isPro: boolean;
  isAdmin: boolean;
}
```

### 5.4 Routing Configuration

#### 5.4.1 Route Definitions
```typescript
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/memorials',
    element: <MemorialListPage />,
  },
  {
    path: '/memorials/:id',
    element: <MemorialDetailPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/create-memorial',
    element: <ProtectedRoute><MemorialCreatePage /></ProtectedRoute>,
  },
  {
    path: '/my-memorials',
    element: <ProtectedRoute><MyMemorialsPage /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <AdminRoute><AdminDashboardPage /></AdminRoute>,
  },
];
```

#### 5.4.2 Route Guards
```typescript
// ProtectedRoute: Requires authentication
// AdminRoute: Requires admin role
// PublicRoute: Accessible to all
```

### 5.5 API Client Layer

#### 5.5.1 Axios Configuration
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 5.5.2 Service Functions
```typescript
// services/memorials.ts
export const memorialsService = {
  getMemorials: (page: number, search?: string) =>
    api.get('/memorials', { params: { page, search } }),
  
  getMemorial: (id: string) =>
    api.get(`/memorials/${id}`),
  
  createMemorial: (data: FormData) =>
    api.post('/memorials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateMemorial: (id: string, data: FormData) =>
    api.put(`/memorials/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteMemorial: (id: string) =>
    api.delete(`/memorials/${id}`),
};
```

### 5.6 Form Handling

#### 5.6.1 React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const memorialSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(255),
  birth_date: z.date().optional(),
  death_date: z.date().optional(),
  story: z.string().max(10000).optional(),
  privacy: z.enum(['public', 'link-only']),
  charity_ids: z.array(z.string().uuid()).optional(),
});

type MemorialFormData = z.infer<typeof memorialSchema>;

const MemorialForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MemorialFormData>({
    resolver: zodResolver(memorialSchema),
  });
  
  // Form implementation
};
```

### 5.7 Image Handling

#### 5.7.1 Image Upload Component
```typescript
const ImageUpload = ({ maxFiles = 2, onChange }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  
  const handleFileSelect = (files: FileList) => {
    // Validate files (type, size)
    // Generate previews
    // Call onChange callback
  };
  
  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileSelect} />
      <div className="preview-grid">
        {previews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};
```

#### 5.7.2 Image Preview & Validation
- Client-side validation: file type, size, dimensions
- Preview before upload
- Progress indicator during upload
- Error handling for failed uploads

### 5.8 Error Handling

#### 5.8.1 Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### 5.8.2 Error Messages
- Inline form validation errors
- Toast notifications for API errors
- User-friendly error messages (no technical details)
- Retry mechanisms for network errors

### 5.9 Loading States

#### 5.9.1 Loading Indicators
- Skeleton loaders for content
- Spinner for actions
- Progress bars for file uploads
- Optimistic updates where appropriate

### 5.10 Responsive Design

#### 5.10.1 Breakpoints
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

#### 5.10.2 Mobile Optimizations
- Touch-friendly buttons (min 44x44px)
- Swipeable carousels
- Collapsible navigation
- Optimized image loading (lazy loading, responsive images)

### 5.11 Performance Optimizations

#### 5.11.1 Code Splitting
```typescript
const AdminDashboard = lazy(() => import('./pages/AdminDashboardPage'));
const MemorialCreatePage = lazy(() => import('./pages/MemorialCreatePage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
</Suspense>
```

#### 5.11.2 Image Optimization
- Lazy loading images
- Responsive images (srcset)
- WebP format with fallbacks
- Image compression

#### 5.11.3 Caching Strategy
- React Query caching
- Browser caching for static assets
- Service Worker for offline support (future)

---

## 6. Security Specifications

### 6.1 Authentication & Authorization

#### 6.1.1 Password Security
- **Hashing:** bcrypt with cost factor 12
- **Requirements:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Storage:** Never store plaintext passwords
- **Password Reset:** (Future feature, not in MVP)

#### 6.1.2 JWT Implementation
- **Algorithm:** HS256 (symmetric) for MVP, RS256 (asymmetric) for production
- **Token Expiration:**
  - Access token: 24 hours
  - Refresh token: 7 days (future)
- **Token Storage:** 
  - Frontend: localStorage (MVP), httpOnly cookies (production)
  - Never expose tokens in URLs or logs
- **Token Validation:** Verify signature, expiration, issuer on every request

#### 6.1.3 Authorization Rules
```python
# Role-based access control
- Public: View public/approved memorials, view comments
- Authenticated: Create memorials, post comments, manage own content
- Pro: Image comments (up to 5 per memorial)
- Admin: Approve/reject memorials, manage charities, moderate comments, toggle Pro status
```

### 6.2 Input Validation & Sanitization

#### 6.2.1 Server-Side Validation
- **All inputs validated using Pydantic models**
- **Email:** RFC 5322 compliant regex
- **URLs:** Validated format, HTTPS enforced for charity URLs
- **Text Fields:** Length limits, XSS prevention
- **File Uploads:** 
  - MIME type validation
  - File extension validation
  - File signature (magic bytes) validation
  - Size limits enforced

#### 6.2.2 XSS Prevention
- **Output Encoding:** All user-generated content HTML-escaped
- **Content Security Policy (CSP):**
  ```
  default-src 'self';
  img-src 'self' data: https:;
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  ```
- **React:** Automatic XSS protection via JSX escaping

#### 6.2.3 SQL Injection Prevention
- **ORM Usage:** SQLAlchemy parameterized queries only
- **No Raw SQL:** Avoid raw SQL queries
- **Input Validation:** Validate all inputs before database operations

#### 6.2.4 CSRF Protection
- **SameSite Cookies:** Set SameSite=Strict for cookies
- **CSRF Tokens:** Implement for state-changing operations (future)
- **Origin Validation:** Verify request origin headers

### 6.3 File Upload Security

#### 6.3.1 Validation Layers
1. **Client-Side:** File type, size validation
2. **Server-Side:** 
   - MIME type check
   - File extension check
   - Magic bytes verification
   - File size limit (5MB)
   - Virus scanning (future)

#### 6.3.2 File Storage
- **Naming:** Use UUIDs for filenames (prevent path traversal)
- **Directory:** Store outside web root
- **Permissions:** Restrict file permissions (644)
- **Scanning:** Scan uploaded files for malicious content (future)

#### 6.3.3 Image Processing
- **Sanitization:** Strip EXIF data (privacy)
- **Resizing:** Prevent malicious oversized images
- **Format Conversion:** Convert to safe formats (JPEG/PNG)

### 6.4 API Security

#### 6.4.1 Rate Limiting
```python
# Per-endpoint rate limits
- Authentication endpoints: 5 requests/minute per IP
- Memorial creation: 10 requests/hour per user
- Comment posting: 20 requests/hour per user
- Admin endpoints: 100 requests/minute per admin
```

#### 6.4.2 CORS Configuration
```python
# Development
allowed_origins = ["http://localhost:3000", "http://localhost:5173"]

# Production
allowed_origins = ["https://memorialbridge.com"]

# Headers
allowed_headers = ["Content-Type", "Authorization"]
allowed_methods = ["GET", "POST", "PUT", "DELETE", "PATCH"]
```

#### 6.4.3 HTTPS Enforcement
- **Production:** Force HTTPS redirects
- **HSTS:** Enable HTTP Strict Transport Security
- **Certificate:** Valid SSL/TLS certificate required

### 6.5 Data Protection

#### 6.5.1 Personal Data Handling
- **Minimal Collection:** Only collect necessary data
- **Data Retention:** Define retention policies
- **User Rights:** Allow users to delete their data
- **Privacy Settings:** Respect privacy choices (public/link-only)

#### 6.5.2 Sensitive Data
- **Never Log:**
  - Passwords (even hashed)
  - JWT tokens
  - Personal information in error logs
- **Email Masking:** Display masked emails in public APIs (`u***@example.com`)

#### 6.5.3 Database Security
- **Connection:** Use SSL/TLS for database connections
- **Credentials:** Store in environment variables, never in code
- **Backups:** Encrypted backups, regular schedule
- **Access Control:** Principle of least privilege for DB users

### 6.6 Content Moderation

#### 6.6.1 Profanity Filter
- **Implementation:** Keyword blacklist (MVP), ML-based (future)
- **Action:** Auto-flag or reject comments with profanity
- **Admin Review:** Flagged content reviewed by admins

#### 6.6.2 Reporting System
- **User Reports:** Allow users to report inappropriate content
- **Admin Queue:** Reported content appears in admin dashboard
- **Action:** Admin can delete or dismiss reports

### 6.7 Security Headers

#### 6.7.1 HTTP Security Headers
```python
# FastAPI middleware
headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
}
```

### 6.8 Security Monitoring

#### 6.8.1 Logging
- **Security Events:** Log authentication failures, authorization denials
- **Suspicious Activity:** Log unusual patterns (multiple failed logins)
- **Audit Trail:** Log admin actions (approve/reject memorials, toggle Pro status)

#### 6.8.2 Error Handling
- **Generic Errors:** Don't expose internal details to users
- **Error Logging:** Log detailed errors server-side only
- **Error Messages:** User-friendly, non-technical messages

### 6.9 Dependency Security

#### 6.9.1 Dependency Management
- **Regular Updates:** Keep dependencies updated
- **Vulnerability Scanning:** Use tools like `safety` (Python) and `npm audit` (Node)
- **Pin Versions:** Pin exact versions in production
- **Review Changes:** Review dependency updates before applying

### 6.10 Environment Variables

#### 6.10.1 Required Secrets
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=your-secret-key-here  # For JWT signing
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
UPLOAD_DIR=/path/to/uploads
S3_BUCKET_NAME=memorial-bridge-uploads  # Production
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
ADMIN_EMAIL=admin@memorialbridge.com  # For initial admin creation

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENVIRONMENT=development
```

#### 6.10.2 Secret Management
- **Never Commit:** Add `.env` to `.gitignore`
- **Use Secrets Manager:** AWS Secrets Manager, HashiCorp Vault (production)
- **Rotate Regularly:** Rotate secrets periodically

### 6.11 Security Checklist

#### Pre-Deployment
- [ ] All dependencies updated and scanned
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] File upload validation implemented
- [ ] Error handling doesn't expose internals
- [ ] Authentication/authorization tested
- [ ] CORS configured correctly
- [ ] Database credentials secured
- [ ] Logging configured (no secrets in logs)

---

## 7. Design System & Visual Language

### 7.1 Design Philosophy

#### 7.1.1 Core Principles
- **Empathetic:** Recognize and respect users' emotional state
- **Calming:** Use soft colors, gentle animations, spacious layouts
- **Dignified:** Maintain respect and warmth in all interactions
- **Accessible:** Ensure usability for all abilities
- **Trustworthy:** Build trust through transparency and consistency
- **Culturally Sensitive:** Respect global diversity and cultural differences

#### 7.1.2 Tone of Voice
- **Language:** Plain, compassionate, encouraging
- **Messaging:** Supportive, patient, non-pressuring
- **Examples:**
  - ✅ "It's okay to take your time"
  - ✅ "Your memorial has been created and is awaiting approval"
  - ✅ "Thank you for helping maintain a respectful community"
  - ❌ "Error: Invalid input"
  - ❌ "You must complete this form"

### 7.2 Color Palette

#### 7.2.1 Base Colors
```css
:root {
  /* Backgrounds */
  --color-bg-primary: #FFFFFF;        /* Pure white */
  --color-bg-secondary: #F5F5F5;      /* Warm light grey */
  --color-bg-tertiary: #ECECEC;       /* Alternate section background */
  
  /* Text */
  --color-text-primary: #333333;       /* Dark grey (not pure black) */
  --color-text-secondary: #666666;    /* Medium grey */
  --color-text-tertiary: #999999;     /* Light grey */
  
  /* Primary Accent - Pastel Blue */
  --color-accent-primary: #A3BED7;    /* Sky at dawn */
  --color-accent-primary-dark: #8BA8C7; /* Hover state */
  --color-accent-primary-light: #C5D9E8; /* Light variant */
  
  /* Secondary Accent - Soft Green */
  --color-accent-secondary: #B8D9C3;  /* Growth, renewal */
  --color-accent-secondary-dark: #A0C9B0;
  --color-accent-secondary-light: #D4E8DD;
  
  /* Tertiary Accent - Blush Rose */
  --color-accent-tertiary: #EED2D1;   /* Compassion, warmth */
  --color-accent-tertiary-dark: #E5BDBB;
  
  /* Quaternary Accent - Muted Lavender */
  --color-accent-quaternary: #DAD4E9; /* Calming, spiritual */
  --color-accent-quaternary-dark: #C8C0DB;
  
  /* Status Colors */
  --color-success: #B8D9C3;           /* Soft green */
  --color-error: #E5BDBB;             /* Soft red/pink */
  --color-warning: #E8D4A3;           /* Soft yellow */
  --color-info: #A3BED7;              /* Pastel blue */
  
  /* Borders & Dividers */
  --color-border: #E0E0E0;            /* Light grey */
  --color-border-light: #F0F0F0;      /* Very light grey */
}
```

#### 7.2.2 Color Usage Guidelines
- **Primary Accent (Blue):** Primary buttons, links, active states
- **Secondary Accent (Green):** Success states, secondary buttons, positive actions
- **Tertiary Accent (Rose):** Hover states, love/memory icons
- **Quaternary Accent (Lavender):** Alternative highlights, feature icons
- **Backgrounds:** Use light tones, avoid large solid fills
- **Text:** Dark grey (#333) for body text (softer than black)
- **Contrast:** Maintain WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)

### 7.3 Typography

#### 7.3.1 Font Families
```css
:root {
  /* Headings - Elegant Serif */
  --font-heading: 'Playfair Display', 'Lora', Georgia, serif;
  
  /* Body - Clean Sans-Serif */
  --font-body: 'Inter', 'Open Sans', 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Monospace (for code/technical) */
  --font-mono: 'Courier New', monospace;
}
```

#### 7.3.2 Font Scale
```css
:root {
  /* Font Sizes */
  --font-size-hero-title: 2.5rem;      /* 40px */
  --font-size-hero-subtitle: 1.25rem;   /* 20px */
  --font-size-h1: 2rem;                 /* 32px */
  --font-size-h2: 1.5rem;               /* 24px */
  --font-size-h3: 1.25rem;              /* 20px */
  --font-size-h4: 1.125rem;             /* 18px */
  --font-size-body: 1rem;               /* 16px - base */
  --font-size-small: 0.875rem;          /* 14px */
  --font-size-caption: 0.75rem;         /* 12px */
  
  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  --line-height-loose: 1.8;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

#### 7.3.3 Typography Usage
- **Hero Title:** `font-heading`, `font-size-hero-title`, `font-weight-bold`
- **Section Headings:** `font-heading` or `font-body` (semibold), `font-size-h2`
- **Body Text:** `font-body`, `font-size-body`, `line-height-relaxed`
- **Buttons:** `font-body`, `font-weight-medium`
- **Captions:** `font-body`, `font-size-small`

### 7.4 Spacing System

#### 7.4.1 Spacing Scale
```css
:root {
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  --spacing-4xl: 6rem;      /* 96px */
}
```

#### 7.4.2 Layout Spacing
- **Section Padding:** `padding: var(--spacing-3xl) var(--spacing-xl)`
- **Card Padding:** `padding: var(--spacing-lg)`
- **Component Gaps:** `gap: var(--spacing-md)` or `var(--spacing-lg)`
- **Whitespace:** Generous whitespace for calm, uncluttered feel

### 7.5 UI Components

#### 7.5.1 Buttons
```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-accent-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 8px;
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: var(--color-accent-primary-dark);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.btn-primary:focus {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--color-accent-primary);
  border: 2px solid var(--color-accent-primary);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 8px;
}

.btn-secondary:hover {
  background-color: var(--color-accent-primary-light);
}
```

#### 7.5.2 Form Inputs
```css
.input {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: var(--font-size-body);
  font-family: var(--font-body);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px var(--color-accent-primary-light);
}

.input::placeholder {
  color: var(--color-text-tertiary);
  font-style: italic;
}

.input-error {
  border-color: var(--color-error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(229, 189, 187, 0.3);
}
```

#### 7.5.3 Cards
```css
.card {
  background-color: var(--color-bg-primary);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
```

### 7.6 Iconography

#### 7.6.1 Icon Style
- **Style:** Line icons with rounded strokes
- **Weight:** Thin to regular (1-2px stroke)
- **Size:** Consistent sizing (16px, 24px, 32px, 48px)
- **Color:** Accent colors or grey for UI icons
- **Library:** Feather Icons, Heroicons, or custom SVG set

#### 7.6.2 Icon Usage
- **Feature Icons:** Pastel blue or lavender, 48px
- **UI Icons:** Grey (#666), 24px
- **Action Icons:** Accent colors, 20px
- **Always include:** Text labels or aria-labels for accessibility

### 7.7 Imagery Guidelines

#### 7.7.1 Photography Style
- **Hero Images:** Serene nature scenes (sunrises, skies, bridges)
- **Tone:** Soft, calming, hopeful
- **Avoid:** Stark, dramatic, or grief-focused imagery
- **User Photos:** Respectful framing, rounded corners, subtle shadows

#### 7.7.2 Image Treatment
```css
.memorial-image {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.memorial-image-thumbnail {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}
```

### 7.8 Animations & Transitions

#### 7.8.1 Animation Principles
- **Gentle:** Slow, smooth transitions (0.2s - 0.3s)
- **Purposeful:** Every animation serves a purpose
- **Respectful:** Avoid jarring or distracting motion
- **Accessible:** Respect `prefers-reduced-motion`

#### 7.8.2 Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gentle Pulse (for loading) */
@keyframes gentlePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Respect Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.9 Homepage Design Specifications

#### 7.9.1 Hero Section
- **Background:** Full-width banner image (sunrise/nature scene)
- **Overlay:** Subtle dark overlay (20-30% opacity) for text readability
- **Content:**
  - Title: "Honor the lives of those we love"
  - Subtitle: "Keep their memory alive with purpose"
  - Primary CTA: "Create a Memorial" (primary button)
  - Secondary CTA: "Browse Public Memorials" (secondary button)
- **Layout:** Centered or slightly offset, spacious padding

#### 7.9.2 Features Preview Section
- **Layout:** Responsive grid (2 columns desktop, 1 column mobile)
- **Cards:** Feature cards with icons, titles, descriptions
- **Features:**
  1. Create Tributes (photo album/heart icon)
  2. Support Causes (charity ribbon icon)
  3. Leave Messages (chat bubble/dove icon)
  4. Privacy Control (lock/shield icon)

#### 7.9.3 Explore Memorials Section
- **Layout:** Carousel or grid of 3-6 memorial previews
- **Card Content:**
  - Circular/rounded photo thumbnail
  - Name and life dates
  - Short quote/excerpt
- **CTA:** "View All Memorials" button

#### 7.9.4 How It Works Section
- **Layout:** Horizontal timeline (desktop) or vertical list (mobile)
- **Steps:**
  1. Sign Up (user icon)
  2. Create (memorial/flower icon)
  3. Share (share arrows icon)
  4. Support a Cause (charity ribbon icon)
- **Trust Messages:** Integrated below steps

#### 7.9.5 Footer
- **Sections:**
  - About Us (link)
  - Policies (Privacy Policy, Terms of Service)
  - Contact Us
  - Social Media Icons (Instagram, Facebook, LinkedIn, TikTok)
  - Non-Profit Statement
- **Background:** Slightly darker shade (warm grey)
- **Layout:** Multi-column (desktop), stacked (mobile)

### 7.10 Memorial Page Design

#### 7.10.1 Layout
- **Header:** Full name, life dates (large, elegant typography)
- **Images:** Up to 2 images, displayed prominently (gallery style)
- **Story:** Tribute text (readable, spacious)
- **Charities:** Donation section with charity cards
- **Comments:** Separated section below main content

#### 7.10.2 Comment Section
- **Form:** Text input, image upload (Pro users), submit button
- **List:** Chronological order (newest or oldest first, consistent)
- **Items:** User info (masked email), content, image (if any), timestamp
- **Moderation:** Report button on each comment

### 7.11 Empty States

#### 7.11.1 Design Pattern
- **Illustration:** Gentle, symbolic (sun, candle, bridge silhouette)
- **Message:** Supportive, encouraging text
- **Example:** "No memorials yet. When you're ready, you can create a tribute to your loved one and keep their story alive."

### 7.12 Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}

/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## 8. Feature Specifications

### 8.1 User Authentication System

#### 8.1.1 Registration Flow
**User Story:** As a new user, I want to create an account so I can create memorials.

**Requirements:**
- Email/password registration form
- Email format validation (client + server)
- Password strength validation:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Password confirmation field (must match)
- Real-time validation feedback
- Success message after registration
- Auto-login after successful registration (optional)

**UI Elements:**
- Email input field
- Password input field (with show/hide toggle)
- Password confirmation field
- Strength indicator (optional)
- Submit button
- Link to login page

**Error Handling:**
- Display validation errors inline
- Show if email already exists
- Clear, user-friendly error messages

#### 8.1.2 Login Flow
**User Story:** As a registered user, I want to log in to access my account.

**Requirements:**
- Email/password login form
- Remember me option (future)
- Forgot password link (future)
- JWT token issued upon successful login
- Token stored in localStorage (MVP)
- Redirect to homepage or intended page after login
- Update last_login timestamp

**UI Elements:**
- Email input field
- Password input field
- "Remember me" checkbox (future)
- Submit button
- Link to registration page
- Forgot password link (future)

**Error Handling:**
- Show error for invalid credentials
- Rate limiting after failed attempts (server-side)

#### 8.1.3 Logout Flow
**User Story:** As a logged-in user, I want to log out securely.

**Requirements:**
- Logout button in navigation
- Clear JWT token from localStorage
- Redirect to homepage
- Optional: Token blacklist (future)

### 8.2 Memorial Creation Workflow

#### 8.2.1 Create Memorial Form
**User Story:** As an authenticated user, I want to create a memorial for my loved one.

**Requirements:**
- **Access:** Only authenticated users
- **Fields:**
  - Full Name (required, max 255 chars)
  - Birth Date (optional, date picker)
  - Death Date (optional, date picker)
  - Story/Tribute (optional, textarea, max 10000 chars)
  - Privacy Setting (required, radio buttons: "public" or "link-only")
  - Charity Selection (optional, multi-select from active charities)
  - Images (optional, max 2 files, max 5MB each, jpg/png/webp)
- **Validation:**
  - Client-side validation before submit
  - Server-side validation
  - Date validation (death >= birth if both provided)
- **Image Handling:**
  - Preview before upload
  - Show image count (e.g., "1/2 images")
  - Remove image option
  - File type and size validation
- **Submission:**
  - Set status to "pending"
  - Show confirmation message
  - Redirect to "My Memorials" page or memorial detail (if approved)

**UI Elements:**
- Form with all fields
- Image upload component with preview
- Charity multi-select dropdown
- Privacy radio buttons
- Submit button (disabled during submission)
- Cancel button (with confirmation if data entered)

**Success Message:**
"Thank you. Your memorial has been created and is awaiting approval. You'll be notified once it's reviewed."

#### 8.2.2 Edit Memorial
**User Story:** As a memorial creator, I want to edit my memorial.

**Requirements:**
- Only creator can edit
- Same form as create
- Pre-populate with existing data
- Status resets to "pending" after edit
- Show current status
- Update confirmation message

#### 8.2.3 Delete Memorial
**User Story:** As a memorial creator, I want to delete my memorial.

**Requirements:**
- Only creator or admin can delete
- Confirmation dialog before deletion
- Soft delete (mark as deleted) or hard delete
- Remove from public listings immediately
- Success message

### 8.3 Memorial Viewing

#### 8.3.1 Public Memorial List
**User Story:** As a visitor, I want to browse public memorials.

**Requirements:**
- Display only approved, public memorials
- Pagination (20 per page)
- Search by name (optional)
- Each listing shows:
  - Thumbnail image (if available)
  - Full name
  - Life dates (if available)
  - Link to full memorial page
- Responsive grid layout
- Loading states
- Empty state if no memorials

**Filters (Future):**
- Sort by date (newest/oldest)
- Filter by date range
- Filter by associated charity

#### 8.3.2 Memorial Detail Page
**User Story:** As a visitor, I want to view a full memorial page.

**Requirements:**
- Display all memorial information:
  - Full name (large, prominent)
  - Birth and death dates
  - Story/tribute text
  - Images (up to 2, gallery style)
  - Associated charities (if any)
- Show donation links for charities
- Display comments section below
- Share functionality (copy link)
- Respect privacy setting:
  - Public: Accessible via URL, appears in listings
  - Link-only: Accessible via URL, NOT in listings

**UI Layout:**
- Hero section with name and dates
- Image gallery
- Story section
- Charities section (if applicable)
- Comments section

### 8.4 Comment System

#### 8.4.1 Post Comment
**User Story:** As an authenticated user, I want to leave a comment on a memorial.

**Requirements:**
- Only authenticated users can comment
- Text content (required, max 5000 chars)
- Image upload (Pro users only, max 1 per comment, max 5MB)
- Image limit enforcement:
  - Pro users: Max 5 image comments per memorial per user
  - Show count: "3/5 image comments used"
  - Prevent upload if limit reached
- Auto-filter profanity
- Success message
- Comment appears immediately (optimistic update)

**UI Elements:**
- Textarea for comment
- Image upload button (Pro users only, disabled if limit reached)
- Image count indicator (Pro users)
- Submit button
- Character count (optional)

**Business Rules:**
- Free users: Text-only comments
- Pro users: Can include images (up to 5 per memorial)
- Profanity filter: Auto-flag or reject
- Comments displayed chronologically (newest or oldest first, consistent)

#### 8.4.2 View Comments
**User Story:** As a visitor, I want to read comments on a memorial.

**Requirements:**
- Display all comments for approved memorials
- Show:
  - User info (masked email: "u***@example.com")
  - Comment content
  - Image (if any)
  - Timestamp
  - Report button
- Pagination if many comments
- Loading states

#### 8.4.3 Delete Comment
**User Story:** As a comment author or admin, I want to delete a comment.

**Requirements:**
- Only author or admin can delete
- Confirmation dialog
- Remove immediately from UI
- Update image count if image comment deleted (Pro users)

#### 8.4.4 Report Comment
**User Story:** As a user, I want to report inappropriate comments.

**Requirements:**
- Report button on each comment
- Optional reason field
- Submit report
- Show confirmation: "Thank you for helping maintain a respectful community"
- Flag comment in database for admin review

### 8.5 Pro Plan Subscription (Mocked)

#### 8.5.1 Pro Status Management
**User Story:** As an admin, I want to toggle user Pro status for testing.

**Requirements:**
- Admin-only feature
- Toggle user's `is_pro` field
- Update immediately
- Show in user list
- No payment processing (MVP)

**UI Elements:**
- User list in admin dashboard
- Toggle switch for each user
- Pro badge indicator

#### 8.5.2 Pro Features
**User Story:** As a Pro user, I want to upload images in comments.

**Requirements:**
- Pro users see image upload option in comment form
- Free users see upgrade prompt or disabled upload
- Enforce 5 image comment limit per memorial
- Show usage indicator

**UI Elements:**
- Image upload button (enabled for Pro, disabled for Free)
- Usage indicator: "3/5 image comments used"
- Upgrade prompt for Free users (future)

### 8.6 Charity Management

#### 8.6.1 Admin: Create Charity
**User Story:** As an admin, I want to add charities to the platform.

**Requirements:**
- Admin-only access
- Form fields:
  - Name (required)
  - Description (optional)
  - URL (required, must be HTTPS)
- Validation:
  - URL format validation
  - Unique name (optional)
- Success message
- Appears in charity list immediately

#### 8.6.2 Admin: Edit/Delete Charity
**User Story:** As an admin, I want to manage existing charities.

**Requirements:**
- Edit form (same as create)
- Soft delete (set is_active=false)
- Cannot delete if associated with memorials (or handle gracefully)

#### 8.6.3 Associate Charities with Memorial
**User Story:** As a memorial creator, I want to link charities to my memorial.

**Requirements:**
- Multi-select dropdown in memorial form
- Show active charities only
- Optional selection
- Display on memorial page with donation links

### 8.7 Admin Dashboard

#### 8.7.1 Admin Access
**User Story:** As an admin, I want to access the admin dashboard.

**Requirements:**
- Admin login (same as regular login, role-based access)
- Admin link in navigation (only visible to admins)
- Dashboard overview page

#### 8.7.2 Pending Memorials Review
**User Story:** As an admin, I want to review and approve/reject pending memorials.

**Requirements:**
- List all pending memorials
- Show memorial details:
  - Full name, dates, story
  - Images
  - Creator info
  - Created date
- Actions:
  - Approve button → Set status to "approved"
  - Reject button → Set status to "rejected", optional reason
- Pagination
- Filter by status (optional)

**UI Elements:**
- Memorial cards/list
- Approve/Reject buttons
- Rejection reason modal (optional)
- Status indicators

#### 8.7.3 User Management
**User Story:** As an admin, I want to view and manage users.

**Requirements:**
- List all users
- Show:
  - Email
  - Pro status
  - Admin status
  - Created date
- Toggle Pro status
- Search/filter (optional)

#### 8.7.4 Comment Moderation
**User Story:** As an admin, I want to review flagged comments.

**Requirements:**
- List flagged comments
- Show:
  - Comment content
  - Memorial link
  - User info
  - Flag reason
  - Flagged date
- Actions:
  - Delete comment
  - Dismiss flag
- Filter by status

#### 8.7.5 Charity Management
**User Story:** As an admin, I want to manage charities.

**Requirements:**
- List all charities
- Create/Edit/Delete actions
- Show active/inactive status
- Count of associated memorials (optional)

---

## 9. Development Guidelines

### 9.1 Code Quality Standards

#### 9.1.1 Python (Backend)
- **Style Guide:** PEP 8
- **Linting:** flake8, black (formatter), isort (import sorting)
- **Type Hints:** Use type hints for all functions
- **Docstrings:** Google-style docstrings for public functions/classes
- **Line Length:** Max 100 characters (black default)
- **Naming:**
  - Functions/methods: `snake_case`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private: Prefix with `_`

**Example:**
```python
from typing import Optional
from datetime import datetime
from uuid import UUID

async def get_memorial_by_id(
    memorial_id: UUID,
    db: AsyncSession
) -> Optional[Memorial]:
    """
    Retrieve a memorial by its ID.
    
    Args:
        memorial_id: The UUID of the memorial
        db: Database session
        
    Returns:
        Memorial object if found, None otherwise
    """
    result = await db.execute(
        select(Memorial).where(Memorial.id == memorial_id)
    )
    return result.scalar_one_or_none()
```

#### 9.1.2 TypeScript/React (Frontend)
- **Style Guide:** ESLint + Prettier
- **Linting:** ESLint with React plugin
- **Type Safety:** Strict TypeScript mode
- **Naming:**
  - Components: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities

**Example:**
```typescript
interface MemorialCardProps {
  memorial: Memorial;
  onView: (id: string) => void;
}

export const MemorialCard: React.FC<MemorialCardProps> = ({
  memorial,
  onView,
}) => {
  return (
    <div className="memorial-card" onClick={() => onView(memorial.id)}>
      {/* Component content */}
    </div>
  );
};
```

### 9.2 Project Structure Standards

#### 9.2.1 Backend Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration settings
│   ├── dependencies.py        # Shared dependencies
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── memorial.py
│   │   └── comment.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── memorial.py
│   │   └── comment.py
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── memorials.py
│   │   │   ├── comments.py
│   │   │   └── admin.py
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── memorial_service.py
│   │   └── comment_service.py
│   ├── repositories/           # Data access
│   │   ├── __init__.py
│   │   ├── user_repository.py
│   │   ├── memorial_repository.py
│   │   └── comment_repository.py
│   ├── utils/                  # Utilities
│   │   ├── __init__.py
│   │   ├── security.py         # Password hashing, JWT
│   │   ├── file_upload.py
│   │   └── profanity_filter.py
│   └── middleware/             # Custom middleware
│       ├── __init__.py
│       └── error_handler.py
├── tests/                      # Test files
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_memorials.py
│   └── test_comments.py
├── alembic/                    # Database migrations
├── requirements.txt
├── .env.example
└── README.md
```

#### 9.2.2 Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── components/            # Reusable components
│   ├── pages/                 # Page components
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API clients
│   ├── store/                 # State management
│   ├── utils/                 # Utilities
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global styles
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

### 9.3 Git Workflow

#### 9.3.1 Branch Strategy
- **main:** Production-ready code
- **develop:** Development branch
- **feature/:** Feature branches (e.g., `feature/user-authentication`)
- **bugfix/:** Bug fix branches
- **hotfix/:** Critical production fixes

#### 9.3.2 Commit Messages
Follow Conventional Commits:
```
feat: add user authentication
fix: resolve image upload validation issue
docs: update API documentation
style: format code with black
refactor: reorganize service layer
test: add tests for memorial creation
chore: update dependencies
```

#### 9.3.3 Pull Request Process
1. Create feature branch from `develop`
2. Make changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Create PR with description
6. Code review required
7. Merge to `develop`
8. Deploy to staging (if applicable)
9. Merge to `main` for production

### 9.4 Environment Configuration

#### 9.4.1 Environment Variables
**Backend (.env):**
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/memorialbridge

# Security
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Environment
ENVIRONMENT=development
DEBUG=True

# Admin
ADMIN_EMAIL=admin@memorialbridge.com
```

**Frontend (.env):**
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENVIRONMENT=development
```

#### 9.4.2 Configuration Management
- Use Pydantic Settings for backend config
- Never commit `.env` files
- Provide `.env.example` with placeholder values
- Document all required variables

### 9.5 Database Migrations

#### 9.5.1 Alembic Setup
```python
# Use Alembic for database migrations
# Create migration: alembic revision --autogenerate -m "description"
# Apply migration: alembic upgrade head
# Rollback: alembic downgrade -1
```

#### 9.5.2 Migration Guidelines
- Always create migrations for schema changes
- Test migrations on development database first
- Include rollback scripts
- Document breaking changes
- Never edit existing migrations (create new ones)

### 9.6 Error Handling Patterns

#### 9.6.1 Backend Error Handling
```python
from fastapi import HTTPException, status

# Custom exceptions
class MemorialNotFoundError(Exception):
    pass

class UnauthorizedError(Exception):
    pass

# Error handler
@app.exception_handler(MemorialNotFoundError)
async def memorial_not_found_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Memorial not found"}
    )
```

#### 9.6.2 Frontend Error Handling
```typescript
// API error handling
try {
  const response = await api.post('/memorials', data);
} catch (error) {
  if (error.response?.status === 422) {
    // Handle validation errors
    setErrors(error.response.data.errors);
  } else {
    // Handle other errors
    showToast('An error occurred. Please try again.');
  }
}
```

### 9.7 Logging Standards

#### 9.7.1 Backend Logging
```python
import logging

logger = logging.getLogger(__name__)

# Use appropriate log levels
logger.debug("Detailed information for debugging")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error occurred", exc_info=True)
logger.critical("Critical error")
```

#### 9.7.2 Logging Guidelines
- Log security events (auth failures, unauthorized access)
- Log errors with context
- Never log sensitive data (passwords, tokens, personal info)
- Use structured logging (JSON format for production)
- Include request IDs for tracing

### 9.8 Documentation Requirements

#### 9.8.1 Code Documentation
- Docstrings for all public functions/classes
- Inline comments for complex logic
- Type hints for better IDE support
- README files for each major module

#### 9.8.2 API Documentation
- FastAPI auto-generates OpenAPI/Swagger docs
- Document all endpoints, request/response models
- Include example requests/responses
- Document error responses

#### 9.8.3 User Documentation
- User guide for creating memorials
- Admin guide for moderation
- API documentation for developers

### 9.9 Performance Guidelines

#### 9.9.1 Database Queries
- Use eager loading for related data (avoid N+1 queries)
- Add indexes for frequently queried fields
- Use pagination for large datasets
- Optimize queries with EXPLAIN ANALYZE

#### 9.9.2 API Performance
- Implement caching where appropriate
- Use async/await for I/O operations
- Rate limiting to prevent abuse
- Response compression (gzip)

#### 9.9.3 Frontend Performance
- Code splitting for routes
- Lazy load images
- Optimize bundle size
- Use React.memo for expensive components
- Debounce search inputs

### 9.10 Testing Requirements

#### 9.10.1 Test Coverage Goals
- Backend: Minimum 80% code coverage
- Frontend: Test critical user flows
- Integration tests for API endpoints
- E2E tests for key workflows (optional for MVP)

#### 9.10.2 Testing Best Practices
- Write tests before fixing bugs (TDD where possible)
- Test edge cases and error conditions
- Use fixtures for test data
- Keep tests independent and isolated
- Mock external dependencies

---

## 10. Deployment Strategy

### 10.1 Development Environment Setup

#### 10.1.1 Local Development
**Requirements:**
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

**Setup Steps:**
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with local database credentials
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

#### 10.1.2 Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: memorialbridge
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://user:password@db/memorialbridge
    depends_on:
      - db
    volumes:
      - ./backend:/app
      - ./uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:8000/api/v1
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 10.2 Production Deployment

#### 10.2.1 Hosting Platforms
**MVP Options:**
- **Replit:** Free tier, easy deployment
- **Render:** Free tier for PostgreSQL + apps
- **Railway:** Simple deployment
- **Fly.io:** Global edge deployment

**Production Options:**
- **AWS:** EC2, RDS, S3, CloudFront
- **Google Cloud:** Compute Engine, Cloud SQL, Cloud Storage
- **DigitalOcean:** Droplets, Managed Databases, Spaces
- **Heroku:** Platform-as-a-Service (paid)

#### 10.2.2 Backend Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure production database
- [ ] Set up SSL/TLS certificate
- [ ] Configure CORS for production domain
- [ ] Set up file storage (S3 or equivalent)
- [ ] Configure logging and monitoring
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test all endpoints
- [ ] Load testing (optional)

#### 10.2.3 Frontend Deployment Checklist
- [ ] Build production bundle (`npm run build`)
- [ ] Set production API URL
- [ ] Configure CDN (if applicable)
- [ ] Set up domain and SSL
- [ ] Test all routes
- [ ] Verify API connectivity
- [ ] Test on multiple browsers
- [ ] Test responsive design
- [ ] Verify accessibility

### 10.3 Database Migration Strategy

#### 10.3.1 Migration Process
1. **Development:** Create migration locally
2. **Test:** Test migration on staging database
3. **Backup:** Backup production database
4. **Deploy:** Run migration on production
5. **Verify:** Verify data integrity
6. **Rollback Plan:** Keep rollback script ready

#### 10.3.2 Backup Strategy
- **Frequency:** Daily automated backups
- **Retention:** 30 days
- **Storage:** Encrypted backups in separate location
- **Testing:** Regular restore tests

### 10.4 File Storage Strategy

#### 10.4.1 Development
- Local filesystem: `./uploads/`
- Directory structure:
  ```
  uploads/
  ├── memorials/
  │   ├── {memorial_id}/
  │   │   ├── image1.jpg
  │   │   └── image2.jpg
  └── comments/
      └── {comment_id}/
          └── image.jpg
  ```

#### 10.4.2 Production
- **S3-Compatible Storage:**
  - AWS S3
  - DigitalOcean Spaces
  - Cloudflare R2
  - MinIO (self-hosted)
- **CDN:** CloudFront or Cloudflare for image delivery
- **Image Optimization:** Generate thumbnails, use WebP format

### 10.5 Environment-Specific Configuration

#### 10.5.1 Development
```python
# config.py
class Settings:
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql+asyncpg://localhost/memorialbridge"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    UPLOAD_DIR: str = "./uploads"
```

#### 10.5.2 Production
```python
class Settings:
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    CORS_ORIGINS: list = ["https://memorialbridge.com"]
    S3_BUCKET: str = os.getenv("S3_BUCKET_NAME")
    S3_REGION: str = os.getenv("S3_REGION")
```

### 10.6 Monitoring & Logging

#### 10.6.1 Application Monitoring
- **Health Check Endpoint:** `/health`
- **Metrics:** Response times, error rates, request counts
- **Uptime Monitoring:** External service (UptimeRobot, Pingdom)
- **Error Tracking:** Sentry or similar

#### 10.6.2 Logging
- **Structured Logging:** JSON format
- **Log Levels:** DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Log Aggregation:** Centralized logging service
- **Retention:** 30 days minimum

### 10.7 Security in Production

#### 10.7.1 Security Checklist
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] JWT secret key strong and unique
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] File upload validation strict
- [ ] Regular security updates
- [ ] Dependency vulnerability scanning

#### 10.7.2 SSL/TLS Configuration
- **Certificate:** Let's Encrypt (free) or commercial
- **Auto-renewal:** Configure automatic renewal
- **HSTS:** Enable HTTP Strict Transport Security
- **TLS Version:** Minimum TLS 1.2

### 10.8 Scaling Considerations

#### 10.8.1 Horizontal Scaling
- **Stateless Backend:** FastAPI is stateless, easy to scale
- **Load Balancer:** Distribute traffic across instances
- **Database:** Connection pooling, read replicas
- **File Storage:** CDN for static assets

#### 10.8.2 Vertical Scaling
- **Database:** Increase resources as needed
- **Application:** Increase memory/CPU
- **Monitoring:** Track resource usage

### 10.9 Deployment Automation

#### 10.9.1 CI/CD Pipeline (Future)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: |
          # Deployment commands
      - name: Deploy Frontend
        run: |
          # Deployment commands
```

#### 10.9.2 Manual Deployment (MVP)
1. Pull latest code
2. Run database migrations
3. Install/update dependencies
4. Build frontend
5. Restart services
6. Verify deployment

---

## 11. Testing Strategy

### 11.1 Backend Testing

#### 11.1.1 Unit Tests
**Framework:** pytest, pytest-asyncio

**Test Structure:**
```python
# tests/test_memorial_service.py
import pytest
from app.services.memorial_service import MemorialService

@pytest.mark.asyncio
async def test_create_memorial_success():
    # Arrange
    service = MemorialService(db_session)
    memorial_data = {
        "full_name": "Test User",
        "privacy": "public"
    }
    
    # Act
    result = await service.create_memorial(user_id, memorial_data)
    
    # Assert
    assert result.full_name == "Test User"
    assert result.status == "pending"
```

**Coverage Areas:**
- Service layer business logic
- Utility functions
- Validation logic
- Error handling

#### 11.1.2 Integration Tests
**Framework:** pytest, httpx (async HTTP client)

**Test Structure:**
```python
# tests/test_api_memorials.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_memorial_endpoint(client: AsyncClient, auth_token):
    response = await client.post(
        "/api/v1/memorials",
        json={
            "full_name": "Test User",
            "privacy": "public"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
```

**Coverage Areas:**
- API endpoints
- Authentication/authorization
- Database operations
- File uploads
- Error responses

#### 11.1.3 Test Fixtures
```python
# tests/conftest.py
import pytest
from app.database import get_db
from app.models import User, Memorial

@pytest.fixture
async def db_session():
    # Create test database session
    yield session
    # Cleanup

@pytest.fixture
async def test_user(db_session):
    user = User(email="test@example.com", ...)
    db_session.add(user)
    await db_session.commit()
    return user

@pytest.fixture
async def auth_token(client, test_user):
    response = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password"
    })
    return response.json()["access_token"]
```

### 11.2 Frontend Testing

#### 11.2.1 Component Tests
**Framework:** Vitest, React Testing Library

**Test Structure:**
```typescript
// tests/components/MemorialCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MemorialCard } from '@/components/memorial/MemorialCard';

describe('MemorialCard', () => {
  it('displays memorial name', () => {
    const memorial = {
      id: '1',
      full_name: 'John Doe',
      // ...
    };
    
    render(<MemorialCard memorial={memorial} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

**Coverage Areas:**
- Component rendering
- User interactions
- Form validation
- Error states
- Loading states

#### 11.2.2 Hook Tests
```typescript
// tests/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

#### 11.2.3 API Mocking
```typescript
// Mock API calls in tests
import { vi } from 'vitest';
import * as memorialsService from '@/services/memorials';

vi.mock('@/services/memorials', () => ({
  getMemorials: vi.fn(() => Promise.resolve({ items: [] })),
}));
```

### 11.3 E2E Testing (Optional for MVP)

#### 11.3.1 E2E Framework
**Options:**
- Playwright
- Cypress
- Selenium

**Key Test Scenarios:**
1. User registration → Login → Create memorial → View memorial
2. Admin login → Approve memorial → View in public list
3. Post comment → Report comment → Admin review

### 11.4 Test Data Management

#### 11.4.1 Test Database
- Separate test database
- Reset before each test suite
- Use factories for test data generation
- Seed common test data

#### 11.4.2 Test Files
- Mock file uploads
- Test image validation
- Test file size limits

### 11.5 Test Coverage Goals

#### 11.5.1 Coverage Targets
- **Backend:** Minimum 80% code coverage
- **Critical Paths:** 100% coverage (auth, memorial creation, admin actions)
- **Frontend:** Test all user-facing features
- **API:** Test all endpoints

#### 11.5.2 Coverage Tools
- **Backend:** pytest-cov
- **Frontend:** Vitest coverage
- **Reports:** Generate HTML coverage reports

### 11.6 Test Execution

#### 11.6.1 Running Tests
```bash
# Backend
pytest                    # Run all tests
pytest tests/test_auth.py # Run specific test file
pytest -v                # Verbose output
pytest --cov=app         # With coverage

# Frontend
npm test                  # Run tests in watch mode
npm run test:coverage     # With coverage
```

#### 11.6.2 CI Integration
- Run tests on every PR
- Block merge if tests fail
- Generate coverage reports
- Fail if coverage drops below threshold

---

## 12. Accessibility & Internationalization

### 12.1 Accessibility (WCAG 2.1 AA Compliance)

#### 12.1.1 Color Contrast
- **Normal Text:** Minimum 4.5:1 contrast ratio
- **Large Text:** Minimum 3:1 contrast ratio
- **Interactive Elements:** Minimum 3:1 contrast ratio
- **Tools:** Use contrast checkers (WebAIM Contrast Checker)

#### 12.1.2 Keyboard Navigation
- **Tab Order:** Logical, sequential tab order
- **Focus Indicators:** Visible focus outlines (custom styled)
- **Skip Links:** Skip to main content link
- **No Keyboard Traps:** All interactive elements keyboard accessible

#### 12.1.3 Screen Reader Support
- **Semantic HTML:** Use proper HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- **ARIA Labels:** Add ARIA labels where needed
- **Alt Text:** Descriptive alt text for all images
- **Form Labels:** Explicit labels for all form inputs
- **Error Messages:** Associate error messages with inputs using `aria-describedby`

**Example:**
```html
<input
  type="email"
  id="email"
  aria-label="Email address"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>
)}
```

#### 12.1.4 Responsive Design
- **Mobile First:** Design for mobile, enhance for desktop
- **Touch Targets:** Minimum 44x44px for interactive elements
- **Viewport:** Proper viewport meta tag
- **Zoom:** Support up to 200% zoom without loss of functionality

#### 12.1.5 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.2 Internationalization (i18n)

#### 12.2.1 Text Extraction
- **No Hard-coded Text:** All user-facing text in translation files
- **No Text in Images:** Avoid text in images
- **Extractable Strings:** Use i18n library (react-i18next, etc.)

#### 12.2.2 Language Support (Future)
**MVP:** English only, but architecture ready for i18n

**Future Languages:**
- Spanish
- French
- German
- Arabic (RTL support)
- Chinese
- Japanese

#### 12.2.3 RTL Support
- **CSS:** Use logical properties (`margin-inline-start` instead of `margin-left`)
- **Layout:** Test layout in RTL mode
- **Icons:** Mirror icons where appropriate

**Example:**
```css
.card {
  margin-inline-start: 1rem; /* Works for both LTR and RTL */
  padding-inline: 1rem;
}
```

#### 12.2.4 Date & Number Formatting
- **Dates:** Use locale-aware formatting
- **Numbers:** Respect locale-specific formatting
- **Time Zones:** Display dates in user's timezone

**Example:**
```typescript
const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date);
```

### 12.3 Cultural Sensitivity

#### 12.3.1 Color Meanings
- **Avoid:** Colors with strong cultural associations
- **Use:** Neutral, universally calming colors
- **Test:** With users from different cultures

#### 12.3.2 Imagery
- **Symbols:** Use universal symbols (hearts, flowers, candles)
- **Avoid:** Religious or culturally specific symbols in default UI
- **User Choice:** Allow users to customize their memorials

#### 12.3.3 Content Guidelines
- **Tone:** Respectful, empathetic across cultures
- **Language:** Plain, clear language
- **Examples:** Use diverse examples in documentation

---

## 13. Project Structure

### 13.1 Complete Project Layout

```
MemorialBridge_Vibed/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── utils/
│   │   └── middleware/
│   ├── tests/
│   ├── alembic/
│   ├── uploads/              # Local file storage (dev)
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── docs/
│   ├── api/                  # API documentation
│   ├── deployment/          # Deployment guides
│   └── user-guide/           # User documentation
│
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── PROJECT_RUNBOOK.md        # This document
```

### 13.2 Key Files & Their Purposes

#### 13.2.1 Backend Key Files
- **main.py:** FastAPI application entry point
- **config.py:** Configuration management
- **dependencies.py:** Shared dependencies (DB, auth)
- **models/:** SQLAlchemy database models
- **schemas/:** Pydantic request/response models
- **api/v1/:** API route handlers
- **services/:** Business logic layer
- **repositories/:** Data access layer
- **utils/:** Utility functions (security, file upload, etc.)

#### 13.2.2 Frontend Key Files
- **main.tsx:** React application entry point
- **App.tsx:** Root component
- **router.tsx:** Route configuration
- **components/:** Reusable UI components
- **pages/:** Page components
- **hooks/:** Custom React hooks
- **services/:** API client functions
- **store/:** Context providers
- **types/:** TypeScript type definitions

### 13.3 Development Workflow

#### 13.3.1 Initial Setup
1. Clone repository
2. Set up backend (Python venv, install dependencies, configure DB)
3. Set up frontend (npm install, configure API URL)
4. Run database migrations
5. Start development servers

#### 13.3.2 Daily Development
1. Pull latest changes
2. Create feature branch
3. Make changes
4. Write/update tests
5. Run tests locally
6. Commit changes
7. Push and create PR

#### 13.3.3 Code Review Process
1. PR created
2. Automated tests run
3. Code review by team member
4. Address feedback
5. Merge to develop
6. Deploy to staging (if applicable)
7. Merge to main for production

### 13.4 Documentation Structure

#### 13.4.1 Code Documentation
- Inline comments for complex logic
- Docstrings for functions/classes
- README files in each major directory

#### 13.4.2 API Documentation
- Auto-generated OpenAPI/Swagger docs
- Postman collection (optional)
- Example requests/responses

#### 13.4.3 User Documentation
- User guide for creating memorials
- Admin guide for moderation
- FAQ section

---

## Appendix A: Technology Versions

### Backend Dependencies
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy[asyncio]==2.0.23
alembic==1.12.1
asyncpg==0.29.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

### Frontend Dependencies
```
react==18.2.0
react-dom==18.2.0
react-router-dom==6.20.0
@tanstack/react-query==5.12.0
react-hook-form==7.48.2
zod==3.22.4
axios==1.6.2
typescript==5.3.2
vite==5.0.0
vitest==1.0.0
@testing-library/react==14.1.0
```

---

## Appendix B: Environment Variables Reference

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/memorialbridge

# Security
SECRET_KEY=your-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Environment
ENVIRONMENT=development
DEBUG=True

# Admin
ADMIN_EMAIL=admin@memorialbridge.com

# Production (S3)
S3_BUCKET_NAME=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENVIRONMENT=development
```

---

## Appendix C: API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Memorials
- `GET /api/v1/memorials` - List public memorials
- `GET /api/v1/memorials/{id}` - Get memorial details
- `POST /api/v1/memorials` - Create memorial
- `PUT /api/v1/memorials/{id}` - Update memorial
- `DELETE /api/v1/memorials/{id}` - Delete memorial
- `GET /api/v1/memorials/my` - Get user's memorials

### Comments
- `GET /api/v1/memorials/{id}/comments` - Get comments
- `POST /api/v1/memorials/{id}/comments` - Create comment
- `DELETE /api/v1/comments/{id}` - Delete comment
- `POST /api/v1/comments/{id}/report` - Report comment
- `GET /api/v1/memorials/{id}/comments/image-count` - Get image count

### Charities
- `GET /api/v1/charities` - List charities

### Admin
- `GET /api/v1/admin/memorials/pending` - List pending memorials
- `POST /api/v1/admin/memorials/{id}/approve` - Approve memorial
- `POST /api/v1/admin/memorials/{id}/reject` - Reject memorial
- `GET /api/v1/admin/comments/flagged` - List flagged comments
- `GET /api/v1/admin/users` - List users
- `PATCH /api/v1/admin/users/{id}/pro-status` - Toggle Pro status
- `POST /api/v1/admin/charities` - Create charity
- `PUT /api/v1/admin/charities/{id}` - Update charity
- `DELETE /api/v1/admin/charities/{id}` - Delete charity

---

## Appendix D: Design Tokens Reference

### Colors
See Section 7.2 for complete color palette.

### Typography
See Section 7.3 for complete typography system.

### Spacing
See Section 7.4 for complete spacing system.

### Components
See Section 7.5 for component specifications.

---

## Document Maintenance

### Version History
- **v1.0** (2024): Initial MVP runbook creation

### Update Process
1. Update relevant sections as features evolve
2. Update version number
3. Update "Last Updated" date
4. Document breaking changes
5. Notify team of significant updates

### Contributing
- Follow the structure and formatting of this document
- Keep sections focused and comprehensive
- Include examples where helpful
- Update table of contents when adding sections

---

**End of Project Runbook**

This document serves as the single source of truth for building the Memorial Bridge application. Refer to specific sections as needed during development, and update this document as the project evolves.
