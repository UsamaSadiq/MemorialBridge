# Database Schema Documentation

**Last Updated:** January 28, 2026  
**Version:** 1.0

## Overview

Memorial Bridge uses PostgreSQL with async SQLAlchemy ORM. All tables use UUID primary keys and include timezone-aware timestamps.

---

## Table: Users

**Purpose:** Store user account information and authentication data  
**Owner:** Authentication Service  
**Status:** ✅ Implemented

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | VARCHAR(36) UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| is_pro | BOOLEAN | DEFAULT FALSE | Pro subscription flag |
| is_admin | BOOLEAN | DEFAULT FALSE | Admin role flag |
| created_at | TIMESTAMP TZ | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP TZ | DEFAULT NOW() | Last account update |
| last_login | TIMESTAMP TZ | NULLABLE | Last login timestamp |

**Indexes:**
- `idx_users_email`: On email (for login lookups)
- `idx_users_is_admin`: On is_admin (for admin queries)

**Relationships:**
- One-to-Many: users → memorials (user_id FK)
- One-to-Many: users → comments (user_id FK)

**Constraints:**
- Email format validation: regex pattern matching
- Email uniqueness enforced at database level

---

## Table: Memorials

**Purpose:** Store memorial information created by users  
**Owner:** Memorial Service  
**Status:** ✅ Implemented

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | VARCHAR(36) UUID | PRIMARY KEY | Unique memorial identifier |
| user_id | VARCHAR(36) UUID | FK → users, NOT NULL, INDEX | Creator user reference |
| full_name | VARCHAR(255) | NOT NULL | Person being memorialized |
| birth_date | DATE | NULLABLE | Birth date |
| death_date | DATE | NULLABLE | Death date |
| story | TEXT | NULLABLE | Tribute/memorial story |
| privacy | ENUM | NOT NULL, DEFAULT 'public' | 'public' or 'link-only' |
| status | ENUM | NOT NULL, DEFAULT 'pending', INDEX | 'pending', 'approved', 'rejected' |
| created_at | TIMESTAMP TZ | DEFAULT NOW(), INDEX | Creation timestamp |
| updated_at | TIMESTAMP TZ | DEFAULT NOW() | Last update timestamp |
| approved_at | TIMESTAMP TZ | NULLABLE | Approval timestamp |
| approved_by | VARCHAR(36) UUID | FK → users, NULLABLE | Admin who approved |

**Indexes:**
- `idx_memorials_user_id`: On user_id (for user's memorials)
- `idx_memorials_status`: On status (for moderation queries)
- `idx_memorials_privacy_status`: Composite on (privacy, status)
- `idx_memorials_created_at DESC`: For chronological sorting

**Relationships:**
- Many-to-One: memorials.user_id → users.id
- One-to-Many: memorials → memorial_images
- One-to-Many: memorials → comments
- Many-to-Many: memorials ↔ charities (via memorial_charities)

**Constraints:**
- Date validation: `death_date >= birth_date` (if both provided)
- Status must be one of: pending, approved, rejected
- Privacy must be one of: public, link-only

---

## Table: Memorial_Images

**Purpose:** Store image references for memorials (max 2 per memorial)  
**Owner:** Memorial Service  
**Status:** ✅ Implemented

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | VARCHAR(36) UUID | PRIMARY KEY | Unique image identifier |
| memorial_id | VARCHAR(36) UUID | FK → memorials, NOT NULL, INDEX | Memorial reference |
| image_url | VARCHAR(500) | NOT NULL | File path or URL to image |
| image_order | INTEGER | NOT NULL, CHECK (1-2) | Position in gallery (1 or 2) |
| created_at | TIMESTAMP TZ | DEFAULT NOW() | Upload timestamp |

**Indexes:**
- `idx_memorial_images_memorial_id`: On memorial_id

**Constraints:**
- Unique(memorial_id, image_order): Max 2 images per memorial
- image_order must be 1 or 2
- Cascade delete: Removes images when memorial deleted

**Relationships:**
- Many-to-One: memorial_images.memorial_id → memorials.id

---

## Table: Comments

**Purpose:** Store user comments and tributes on memorials  
**Owner:** Comment Service  
**Status:** ✅ Implemented

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | VARCHAR(36) UUID | PRIMARY KEY | Unique comment identifier |
| memorial_id | VARCHAR(36) UUID | FK → memorials, NOT NULL, INDEX | Memorial reference |
| user_id | VARCHAR(36) UUID | FK → users, NOT NULL, INDEX | Comment author |
| content | TEXT | NOT NULL | Comment text |
| image_url | VARCHAR(500) | NULLABLE | Optional image (pro users) |
| is_flagged | BOOLEAN | DEFAULT FALSE, INDEX | Moderation flag |
| flagged_reason | TEXT | NULLABLE | Reason for flagging |
| created_at | TIMESTAMP TZ | DEFAULT NOW(), INDEX | Creation timestamp |
| updated_at | TIMESTAMP TZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_comments_memorial_id`: On memorial_id
- `idx_comments_user_id`: On user_id
- `idx_comments_created_at DESC`: For chronological sorting
- `idx_comments_is_flagged`: For moderation queries
- `idx_comments_user_memorial`: Composite on (user_id, memorial_id)

**Relationships:**
- Many-to-One: comments.memorial_id → memorials.id
- Many-to-One: comments.user_id → users.id

**Constraints:**
- Content not empty: CHECK (LENGTH(TRIM(content)) > 0)
- Cascade delete: Removes comments when memorial/user deleted

---

## Table: Charities

**Purpose:** Store information about charitable organizations  
**Owner:** Charity Service  
**Status:** ✅ Implemented

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | VARCHAR(36) UUID | PRIMARY KEY | Unique charity identifier |
| name | VARCHAR(255) | NOT NULL | Charity name |
| description | TEXT | NULLABLE | Charity description |
| url | VARCHAR(500) | NOT NULL, CHECK | Charity website URL |
| is_active | BOOLEAN | DEFAULT TRUE, INDEX | Active status |
| created_at | TIMESTAMP TZ | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP TZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_charities_is_active`: On is_active (for listing active charities)

**Constraints:**
- URL format validation: must start with http:// or https://

**Relationships:**
- Many-to-Many: charities ↔ memorials (via memorial_charities)

---

## Table: Memorial_Charities (Junction)

**Purpose:** Link memorials to charities (many-to-many relationship)  
**Owner:** Memorial Service  
**Status:** ✅ Implemented

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| memorial_id | VARCHAR(36) UUID | FK → memorials, PK | Memorial reference |
| charity_id | VARCHAR(36) UUID | FK → charities, PK | Charity reference |
| created_at | TIMESTAMP TZ | DEFAULT NOW() | Association timestamp |

**Indexes:**
- `idx_memorial_charities_memorial_id`: On memorial_id
- `idx_memorial_charities_charity_id`: On charity_id

**Constraints:**
- Primary Key: (memorial_id, charity_id)
- Cascade delete on both sides

---

## Data Type Standards

### IDs
- All primary keys: `VARCHAR(36)` UUID generated via `uuid.uuid4()`
- Foreign keys: Same as referenced table

### Timestamps
- All timestamps: `TIMESTAMP WITH TIME ZONE`
- Default to `CURRENT_TIMESTAMP`
- Always include both `created_at` and `updated_at`
- Use `datetime.datetime.now(datetime.timezone.utc)` in Python

### Text Fields
- Short strings (< 500 chars): `VARCHAR(N)`
- Long text: `TEXT` for unlimited length
- URLs: `VARCHAR(500)`

### Enums
- Status fields: Use ENUM type in PostgreSQL
- Serialize/deserialize via SQLAlchemy Enum

---

## Migration Strategy

**Alembic Configuration:** `backend/alembic/`

### Current State
- Base models created in `app/models/__init__.py`
- Models exported via Base.metadata
- Auto-create tables on FastAPI startup

### Future Migrations
Use Alembic for production databases:
```bash
# Generate migration from model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Performance Considerations

### Indexing Strategy
- All foreign keys are indexed for JOIN performance
- Status field indexed for filtering in queries
- Composite index on (privacy, status) for gallery queries
- created_at DESC indexed for chronological sorting

### Query Optimization
- Use `.select(Model).where(...)` for precise queries
- Lazy load relationships to avoid N+1 queries
- Pagination mandatory for list endpoints (max 100 items)

### Scaling Notes
- Ready for PostgreSQL replication
- UUID primary keys support horizontal scaling
- Consider archiving old deleted records before hard delete

---

## Audit Trail

All tables include:
- `created_at`: Immutable creation timestamp
- `updated_at`: Updated on every modification

Memorial approvals tracked via:
- `approved_at`: When approval happened
- `approved_by`: Which admin approved it

Comment moderation tracked via:
- `is_flagged`: Boolean flag status
- `flagged_reason`: Free-text reason

---

## Future Schema Extensions (Post-M1)

### Planned Additions
- **User Profiles:** Extended user data (bio, avatar, location)
- **User Preferences:** Notification settings, privacy preferences
- **Analytics:** View counts, engagement metrics
- **Email Notifications:** Pending notification queue
- **Comments v2:** Nested replies, reactions
- **Media:** Separate media management for optimized storage
- **Subscriptions:** Billing and payment history
