# Memorial Bridge - Milestone 1 (MVP) Tracking Checklist

**Milestone:** Core Platform Launch  
**Duration:** 4 weeks  
**Total Story Points:** 39  
**Status:** 🟡 Not Started  
**Last Updated:** January 28, 2026

---

## Quick Summary

| Metric | Value |
|--------|-------|
| Total Epics | 7 |
| Total Stories | 35+ |
| Estimated Points | 39 |
| Started | 0% |
| In Progress | 0% |
| Completed | 0% |
| Blocked | 0 |

---

## Epic 1.1: Authentication & User Management
**Status:** ⭕ Not Started | **Points:** 5 | **Assigned To:** _____________

### Features Checklist

**User Registration**
- [ ] Email/password signup endpoint (POST /api/v1/auth/register)
- [ ] Email validation (format check)
- [ ] Email uniqueness enforcement
- [ ] Password strength validation
  - [ ] Min 8 characters
  - [ ] At least 1 uppercase letter
  - [ ] At least 1 lowercase letter
  - [ ] At least 1 number
  - [ ] At least 1 special character
- [ ] Password confirmation match
- [ ] Bcrypt password hashing implementation
- [ ] User creation in database
- [ ] Success response with user_id
- [ ] Error handling for duplicate email
- [ ] Frontend signup form component
- [ ] Form validation on frontend
- [ ] Error messages display
- [ ] Success confirmation message

**User Login**
- [ ] Login endpoint (POST /api/v1/auth/login)
- [ ] Email/password validation
- [ ] JWT token generation
- [ ] Token includes user_id, email, roles
- [ ] Token expiration: 7 days
- [ ] Response with access_token and user data
- [ ] Error handling for invalid credentials
- [ ] Frontend login form component
- [ ] Form validation
- [ ] Error messages
- [ ] Success redirect to dashboard
- [ ] Token storage in localStorage/cookie

**User Logout**
- [ ] Logout endpoint (POST /api/v1/auth/logout)
- [ ] Token removal/blacklist setup
- [ ] Frontend logout action
- [ ] Clear localStorage/cookie
- [ ] Redirect to homepage
- [ ] Confirmation message

**Session Management**
- [ ] JWT middleware in FastAPI
- [ ] Token validation on protected routes
- [ ] Token refresh endpoint (optional for M1)
- [ ] Session persistence check
- [ ] Auto-logout on expiration
- [ ] Remember me functionality (optional)

**User Info Endpoint**
- [ ] GET /api/v1/auth/me endpoint
- [ ] Returns current user info
- [ ] Requires authentication
- [ ] Returns is_pro and is_admin flags
- [ ] Frontend use for profile/dashboard

**Security**
- [ ] CORS configuration
- [ ] HTTPS requirement check
- [ ] Password reset email (optional for M1)
- [ ] Rate limiting on auth endpoints
- [ ] Secure token generation

### Testing Checklist

- [ ] Unit tests: password validation
- [ ] Unit tests: email validation
- [ ] Integration tests: signup flow
- [ ] Integration tests: login flow
- [ ] Integration tests: logout flow
- [ ] E2E tests: complete auth flow
- [ ] Security test: weak password rejected
- [ ] Security test: duplicate email rejected
- [ ] Security test: invalid credentials rejected
- [ ] Load test: concurrent logins

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Epic 1.2: Core Memorial Creation Workflow
**Status:** ⭕ Not Started | **Points:** 8 | **Assigned To:** _____________

### Features Checklist

**Memorial Creation Form (Frontend)**
- [ ] Form component structure
- [ ] Full name input field
- [ ] Birth date field (date picker)
- [ ] Death date field (date picker)
- [ ] Story/tribute text area
- [ ] Privacy selection (radio: public/link-only)
- [ ] Image upload fields (2 max)
- [ ] Form validation on client
- [ ] Real-time validation feedback
- [ ] File size preview
- [ ] Image preview display
- [ ] Submit button (disabled until valid)
- [ ] Cancel button
- [ ] Back/draft save option

**Memorial Creation Endpoint**
- [ ] POST /api/v1/memorials endpoint
- [ ] Authentication required
- [ ] Multipart form-data handling
- [ ] Field validation (Pydantic)
  - [ ] full_name: required, 1-255 chars
  - [ ] birth_date: optional, valid date
  - [ ] death_date: optional, valid date, >= birth_date
  - [ ] story: optional, max 10000 chars
  - [ ] privacy: required, public or link-only
  - [ ] charity_ids: optional array
- [ ] Image file validation
  - [ ] Format: JPEG, PNG, WebP only
  - [ ] Max size: 5MB each
  - [ ] MIME type validation
  - [ ] File signature validation
- [ ] User_id assignment (from token)
- [ ] Status: pending (auto-set)
- [ ] Created_at timestamp
- [ ] Database insert
- [ ] Image storage (local filesystem for dev)
- [ ] Response with memorial_id and status
- [ ] Error handling and messages

**Memorial Editing**
- [ ] PUT /api/v1/memorials/{memorial_id} endpoint
- [ ] Authentication required
- [ ] Ownership verification (only creator)
- [ ] Update allowed fields (name, dates, story, privacy)
- [ ] Image replacement logic
- [ ] Status reset to pending on update
- [ ] Updated_at timestamp
- [ ] Database update
- [ ] Response confirmation
- [ ] Frontend edit form component
- [ ] Pre-populate form with current data
- [ ] Image management (replace/remove)
- [ ] Submit and cancel buttons

**Memorial Deletion**
- [ ] DELETE /api/v1/memorials/{memorial_id} endpoint
- [ ] Authentication required
- [ ] Ownership verification
- [ ] Cascade delete images
- [ ] Cascade delete comments (optional warning)
- [ ] Database delete
- [ ] Image file cleanup
- [ ] Response confirmation
- [ ] Frontend delete confirmation modal
- [ ] Delete button on memorial page
- [ ] Success/error messages

**Image Processing**
- [ ] Image upload validation
- [ ] MIME type check
- [ ] File size check (5MB limit)
- [ ] File signature verification
- [ ] Resize large images (max 2000px)
- [ ] Generate thumbnails (300x300px)
- [ ] Optimize file size (JPEG quality 85%)
- [ ] Store original and thumbnail
- [ ] Return URLs for both
- [ ] Handle upload errors gracefully
- [ ] Progress indicator for uploads
- [ ] Error messages for failed uploads

**Database Schema**
- [ ] Memorials table created
- [ ] Memorial_images table created
- [ ] Indexes on user_id, status, privacy
- [ ] Foreign key constraints
- [ ] Date validation constraints
- [ ] Privacy enum values
- [ ] Status enum values

### Testing Checklist

- [ ] Unit tests: field validation
- [ ] Unit tests: date validation
- [ ] Unit tests: date comparison (death >= birth)
- [ ] Integration tests: create memorial
- [ ] Integration tests: edit memorial
- [ ] Integration tests: delete memorial
- [ ] E2E tests: complete memorial creation
- [ ] E2E tests: image upload
- [ ] Security test: cannot edit others' memorials
- [ ] Security test: non-auth cannot create
- [ ] Performance test: large image upload
- [ ] Performance test: form submission response time

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Epic 1.3: Memorial Gallery & Discovery
**Status:** ⭕ Not Started | **Points:** 6 | **Assigned To:** _____________

### Features Checklist

**Public Memorial Gallery**
- [ ] GET /api/v1/memorials endpoint (public)
- [ ] Filter: approved memorials only
- [ ] Filter: privacy = public only
- [ ] Pagination logic (default: page 1, limit 20)
- [ ] Query params: page, limit, search
- [ ] Sort: newest first (default)
- [ ] Response with items array, total, pages
- [ ] Error handling for invalid page
- [ ] Database query optimization

**Search Functionality**
- [ ] Search by memorial name
- [ ] Search query param
- [ ] Database search query
- [ ] Case-insensitive search
- [ ] Partial match support
- [ ] Response with matching results
- [ ] Empty result handling

**Gallery Frontend Component**
- [ ] Gallery page layout
- [ ] Memorial card component (name, dates, thumbnail)
- [ ] Image loading with placeholder
- [ ] Responsive grid (2 columns desktop, 1 mobile)
- [ ] Card hover effects
- [ ] Click to view detail page
- [ ] Pagination controls
  - [ ] Page numbers
  - [ ] Previous/next buttons
  - [ ] Jump to page input
- [ ] Search bar component
- [ ] Search form submission
- [ ] Results counter
- [ ] Empty state message
- [ ] Loading skeleton/spinner

**Individual Memorial Detail Page**
- [ ] GET /api/v1/memorials/{memorial_id} endpoint
- [ ] Public access (no auth required)
- [ ] Return full memorial data
  - [ ] Full name, dates
  - [ ] Full story text
  - [ ] All images
  - [ ] Charities (if any)
  - [ ] Created_at timestamp
- [ ] Include comments count
- [ ] Verify status = approved
- [ ] Verify privacy (public or link-only accessible)
- [ ] 404 if not found or not accessible

**Memorial Detail Page Frontend**
- [ ] Detail page layout
- [ ] Memorial header with name and dates
- [ ] Full story text display
- [ ] Image gallery display
  - [ ] Main image display
  - [ ] Thumbnail navigation
  - [ ] Image counter
  - [ ] Lightbox/modal view (optional)
- [ ] Share buttons area (prepare for M3)
- [ ] Charity section (if present)
- [ ] Comments section placeholder
- [ ] Back to gallery link
- [ ] Responsive design

**Privacy Enforcement**
- [ ] Link-only memorials: not in gallery
- [ ] Link-only memorials: accessible by direct URL
- [ ] Link-only memorials: no login required
- [ ] Public memorials: in gallery
- [ ] Public memorials: accessible by URL
- [ ] Status enforcement: only approved shown

### Testing Checklist

- [ ] API test: gallery returns approved public only
- [ ] API test: pagination works
- [ ] API test: search functionality
- [ ] API test: detail page data complete
- [ ] API test: link-only not in gallery
- [ ] API test: link-only accessible by URL
- [ ] API test: 404 for non-existent memorial
- [ ] Frontend test: gallery renders
- [ ] Frontend test: pagination navigation
- [ ] Frontend test: search results
- [ ] Frontend test: detail page loads
- [ ] Frontend test: responsive on mobile
- [ ] Performance test: gallery load time < 2s

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Epic 1.4: Basic Comment System
**Status:** ⭕ Not Started | **Points:** 5 | **Assigned To:** _____________

### Features Checklist

**Comment Creation Endpoint**
- [ ] POST /api/v1/memorials/{memorial_id}/comments endpoint
- [ ] Authentication required
- [ ] Validate memorial exists and is approved
- [ ] Content field required (min 1 char, max 5000)
- [ ] User_id from auth token
- [ ] Created_at timestamp
- [ ] Database insert
- [ ] Response with comment_id and data
- [ ] Error handling

**Comment Retrieval Endpoint**
- [ ] GET /api/v1/memorials/{memorial_id}/comments endpoint
- [ ] Public access (no auth required)
- [ ] Filter: memorial_id matches
- [ ] Filter: is_flagged = false (don't show flagged to public)
- [ ] Pagination (default: page 1, limit 50)
- [ ] Sort: oldest first or newest first (configurable)
- [ ] Response with items, total, pages
- [ ] Include user info (masked email)
- [ ] Include timestamp

**Comment Deletion Endpoint**
- [ ] DELETE /api/v1/comments/{comment_id} endpoint
- [ ] Authentication required
- [ ] Owner or admin only
- [ ] Database delete
- [ ] Response confirmation

**Email Masking**
- [ ] Implement masking logic (u***@example.com)
- [ ] Apply to comment author display
- [ ] Test masking accuracy

**Comment Form (Frontend)**
- [ ] Comment textarea field
- [ ] Content validation (1-5000 chars)
- [ ] Character counter
- [ ] Submit button
- [ ] Cancel/clear button
- [ ] Login prompt if not authenticated
- [ ] Success message on submit
- [ ] Error handling

**Comment List (Frontend)**
- [ ] Comments component on detail page
- [ ] Display all comments
- [ ] Show author (masked email)
- [ ] Show timestamp
- [ ] Show content text
- [ ] Pagination controls
- [ ] Sort selector (oldest/newest)
- [ ] Empty state: "No comments yet"
- [ ] Loading state
- [ ] Delete button (if owner/admin)

**Comment Display**
- [ ] Chronological order
- [ ] Author masked email display
- [ ] Readable timestamp (relative or absolute)
- [ ] Content displayed as-is (plain text for M1)
- [ ] Responsive on mobile

### Testing Checklist

- [ ] API test: create comment requires auth
- [ ] API test: comment added to database
- [ ] API test: retrieve comments
- [ ] API test: pagination on comments
- [ ] API test: delete comment by owner
- [ ] API test: cannot delete others' comments
- [ ] API test: email masking works
- [ ] Frontend test: comment form renders
- [ ] Frontend test: submit comment
- [ ] Frontend test: comments list displays
- [ ] Frontend test: pagination works
- [ ] Frontend test: delete button appears for own comment
- [ ] Integration test: create and view comment flow

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Epic 1.5: Admin Review & Approval Workflow
**Status:** ⭕ Not Started | **Points:** 5 | **Assigned To:** _____________

### Features Checklist

**Admin Authentication**
- [ ] Admin role in user model
- [ ] Middleware to check admin status
- [ ] Admin login (same as regular login, but check is_admin)
- [ ] Admin endpoints protected
- [ ] Admin access verification on requests

**Admin Pending Memorials Endpoint**
- [ ] GET /api/v1/admin/memorials/pending endpoint
- [ ] Admin auth required
- [ ] Query memorials where status = pending
- [ ] Pagination
- [ ] Include memorial details + user email
- [ ] Sort: created_at ascending (oldest first)
- [ ] Response with items and total

**Approve Memorial Endpoint**
- [ ] POST /api/v1/admin/memorials/{memorial_id}/approve endpoint
- [ ] Admin auth required
- [ ] Set status to approved
- [ ] Set approved_at timestamp
- [ ] Set approved_by admin_id
- [ ] Database update
- [ ] Response confirmation
- [ ] Trigger email notification (M2)

**Reject Memorial Endpoint**
- [ ] POST /api/v1/admin/memorials/{memorial_id}/reject endpoint
- [ ] Admin auth required
- [ ] Accept optional reason body
- [ ] Set status to rejected
- [ ] Store rejection reason (optional)
- [ ] Database update
- [ ] Response confirmation
- [ ] Trigger email notification (M2)

**Admin Dashboard (Frontend)**
- [ ] Admin dashboard page (protected)
- [ ] Navigation to admin area
- [ ] Pending memorials section
  - [ ] List of pending memorials
  - [ ] Memorial card preview
  - [ ] Images display
  - [ ] Full details expandable
- [ ] Approve button per memorial
- [ ] Reject button per memorial
- [ ] Reason input for rejection
- [ ] Confirm dialog before action
- [ ] Success/error messages
- [ ] Real-time list refresh
- [ ] Loading states

**Admin UI Components**
- [ ] Memorial review card component
- [ ] Approve/reject button component
- [ ] Modal for rejection reason
- [ ] Confirmation dialog
- [ ] Admin layout wrapper
- [ ] Protected route component

**Database Updates**
- [ ] Add is_admin boolean to users table
- [ ] Add approved_at timestamp to memorials
- [ ] Add approved_by foreign key to memorials
- [ ] Add rejection_reason field (optional)
- [ ] Create admin user seed (for testing)

### Testing Checklist

- [ ] API test: pending memorials endpoint
- [ ] API test: approve endpoint works
- [ ] API test: reject endpoint works
- [ ] API test: non-admin cannot access admin endpoints
- [ ] API test: approved memorial appears in gallery
- [ ] API test: rejected memorial not in gallery
- [ ] API test: status changes correctly
- [ ] Frontend test: admin dashboard loads
- [ ] Frontend test: pending memorials display
- [ ] Frontend test: approve button works
- [ ] Frontend test: reject button works
- [ ] Frontend test: rejection reason input
- [ ] Security test: non-admin blocked from admin pages
- [ ] E2E test: complete review workflow

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Epic 1.6: Platform Homepage & Navigation
**Status:** ⭕ Not Started | **Points:** 6 | **Assigned To:** _____________

### Features Checklist

**Homepage Layout**
- [ ] Hero section component
- [ ] Features preview section
- [ ] Memorial preview section
- [ ] How it works section
- [ ] Footer component
- [ ] Responsive grid layout

**Hero Section**
- [ ] Hero banner image
- [ ] Image placeholder/fallback
- [ ] Main title: "Honor the lives of those we love"
- [ ] Subtitle: "Keep their memory alive with purpose"
- [ ] Primary CTA button: "Create a Memorial"
  - [ ] Links to signup (if not logged in)
  - [ ] Links to create form (if logged in)
- [ ] Secondary CTA link: "Browse Public Memorials"
  - [ ] Links to gallery
- [ ] Text overlay styling
- [ ] Responsive on mobile

**Features Preview Section**
- [ ] Feature card 1: "Create Tributes"
- [ ] Feature card 2: "Support Causes"
- [ ] Feature card 3: "Leave Messages"
- [ ] Feature card 4: "Privacy Control"
- [ ] Cards have icons
- [ ] Cards have descriptions
- [ ] Responsive grid (2 per row desktop, 1 mobile)
- [ ] Card styling with shadows and borders
- [ ] Hover effects

**Memorial Preview Section**
- [ ] "Explore Public Memorials" heading
- [ ] Intro text about global community
- [ ] Display 3-6 sample public memorials
- [ ] Memorial cards with:
  - [ ] Thumbnail image
  - [ ] Person's name
  - [ ] Life dates
  - [ ] Short quote/excerpt
- [ ] Cards are clickable (link to detail)
- [ ] "View All Memorials" button
- [ ] Responsive carousel or grid
- [ ] Empty state if no memorials

**How It Works Section**
- [ ] 4-step process display
- [ ] Step 1: "Sign Up"
- [ ] Step 2: "Create"
- [ ] Step 3: "Share"
- [ ] Step 4: "Support a Cause"
- [ ] Icons for each step
- [ ] Description text for each
- [ ] Visual flow connectors
- [ ] Responsive layout

**Trust & Safety Section**
- [ ] "Every memorial is reviewed..." message
- [ ] Shield icon or similar
- [ ] Privacy control message
- [ ] Lock icon
- [ ] "No ads. No fees..." message
- [ ] Professional styling
- [ ] Responsive layout

**Navigation Header**
- [ ] Logo/branding
- [ ] Navigation menu
- [ ] "Browse Memorials" link
- [ ] "Create Memorial" link/button (prominent)
- [ ] User account menu (if logged in)
  - [ ] Display user email
  - [ ] Profile link
  - [ ] Logout link
- [ ] Login/Signup buttons (if not logged in)
- [ ] Mobile hamburger menu
- [ ] Mobile menu drawer
- [ ] Responsive navigation

**Footer**
- [ ] About Us link
- [ ] Privacy Policy link
- [ ] Terms of Service link
- [ ] Contact Us link
- [ ] Social media icons
  - [ ] Facebook
  - [ ] Twitter
  - [ ] Instagram
  - [ ] LinkedIn
- [ ] "Non-profit project" statement
- [ ] Copyright notice
- [ ] Responsive layout
- [ ] Dark background styling

**Styling & Design**
- [ ] Apply design system colors
- [ ] Apply typography system
- [ ] Consistent spacing
- [ ] Consistent component styles
- [ ] Empathetic tone
- [ ] Professional appearance
- [ ] Accessibility compliance
- [ ] Mobile responsive (< 768px, < 1024px, > 1024px)

### Testing Checklist

- [ ] Homepage loads without errors
- [ ] All sections render
- [ ] CTAs link to correct pages
- [ ] Images load properly
- [ ] Navigation works
- [ ] Mobile layout responsive
- [ ] Tablet layout responsive
- [ ] Desktop layout responsive
- [ ] Accessibility: keyboard navigation
- [ ] Accessibility: screen reader friendly
- [ ] Performance: homepage load time < 2s
- [ ] No broken links

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Epic 1.7: Project Infrastructure & Deployment
**Status:** ⭕ Not Started | **Points:** 4 | **Assigned To:** _____________

### Features Checklist

**Docker Setup**
- [ ] Dockerfile for backend (Python FastAPI)
- [ ] Dockerfile for frontend (React/Node)
- [ ] .dockerignore files
- [ ] Multi-stage builds for optimization
- [ ] Base images selected
- [ ] Dependencies installed in Dockerfile
- [ ] Build scripts included

**Docker Compose**
- [ ] docker-compose.yml created
- [ ] Backend service defined
- [ ] Frontend service defined
- [ ] PostgreSQL service defined
- [ ] Volume mounts for data persistence
- [ ] Environment variables in compose
- [ ] Port mappings
- [ ] Service dependencies defined
- [ ] Network configuration
- [ ] Health checks (optional)

**Database Setup**
- [ ] PostgreSQL configuration
- [ ] Database initialization script
- [ ] Schema creation SQL
  - [ ] Users table
  - [ ] Memorials table
  - [ ] Memorial_images table
  - [ ] Comments table
  - [ ] Charities table
  - [ ] Memorial_charities table
- [ ] Indexes creation
- [ ] Constraints definition
- [ ] Seed data (test user, test charities)
- [ ] Migration setup (optional for M1)

**Environment Configuration**
- [ ] .env.example file
- [ ] Environment variables documented
- [ ] Backend env vars:
  - [ ] DATABASE_URL
  - [ ] SECRET_KEY
  - [ ] ALGORITHM (JWT)
  - [ ] ACCESS_TOKEN_EXPIRE_DAYS
  - [ ] UPLOAD_DIR
  - [ ] MAX_FILE_SIZE
  - [ ] ALLOWED_EXTENSIONS
- [ ] Frontend env vars:
  - [ ] VITE_API_BASE_URL
  - [ ] VITE_ENV (dev/prod)
- [ ] .env file in .gitignore
- [ ] Documentation for each var

**Local Development**
- [ ] `docker-compose up` command works
- [ ] Services start correctly
- [ ] Database initializes
- [ ] Backend service healthy
- [ ] Frontend service healthy
- [ ] Backend port (8000) accessible
- [ ] Frontend port (3000 or 5173) accessible
- [ ] Database accessible via connection string
- [ ] Development workflow documented

**Deployment Preparation**
- [ ] Deployment target identified (Replit or similar)
- [ ] Deployment script or documentation
- [ ] Environment setup for production
- [ ] Database migration to production DB
- [ ] Image storage path configuration
- [ ] CORS settings for production
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Error tracking setup (optional)

**Logging & Monitoring**
- [ ] Structured logging setup (backend)
- [ ] Log levels configured
- [ ] Log output to console
- [ ] Log files or centralized logging (optional)
- [ ] Request logging middleware
- [ ] Error logging with stack traces
- [ ] Performance logging (optional)

**CI/CD Pipeline (Optional for M1)**
- [ ] GitHub Actions workflow file
- [ ] Test job setup
- [ ] Build job setup
- [ ] Deploy job setup (manual trigger)
- [ ] Status checks
- [ ] Notification on failure

**Documentation**
- [ ] README.md with setup instructions
- [ ] Development guide
- [ ] Deployment guide
- [ ] Environment variables documented
- [ ] Troubleshooting guide
- [ ] Architecture diagram
- [ ] API documentation links
- [ ] Contributing guidelines

### Testing Checklist

- [ ] `docker-compose up` works without errors
- [ ] All services start
- [ ] Backend is healthy
- [ ] Frontend is healthy
- [ ] Database connection works
- [ ] API endpoints respond
- [ ] Frontend loads
- [ ] Database persists data
- [ ] Logs are generated
- [ ] Hot reload works (optional)
- [ ] Deployment test successful

### Notes & Comments
```
Status Updates:
- 
- 

Blockers:
- 

Decisions Made:
- 
```

---

## Cross-Epic Dependencies & Blockers

### Critical Path
```
1.1 Auth
  ↓
1.2 Memorial Creation ─→ 1.5 Admin Review
  ↓                          ↓
1.3 Gallery ←────────────────┘
  ↓
1.4 Comments
  ↓
1.6 Homepage (incorporates 1.3)
  ↓
1.7 Infrastructure & Deployment
```

### Blocking Issues
| Issue | Epic | Impact | Status |
|-------|------|--------|--------|
| Auth not working | 1.1 | Blocks all other epics | |
| DB schema issues | 1.2 | Blocks memorial creation | |
| Images not uploading | 1.2 | Blocks gallery display | |
| Admin endpoints broken | 1.5 | Blocks content moderation | |

---

## Team Assignment

| Epic | Engineer(s) | Start Date | End Date | Status |
|------|-------------|-----------|----------|--------|
| 1.1 Auth | | | | |
| 1.2 Memorial Creation | | | | |
| 1.3 Gallery | | | | |
| 1.4 Comments | | | | |
| 1.5 Admin Review | | | | |
| 1.6 Homepage | | | | |
| 1.7 Infrastructure | | | | |

---

## Weekly Progress Tracking

### Week 1
**Target:** Complete Epic 1.1 (Auth) - 5 points

| Epic | Mon | Tue | Wed | Thu | Fri | Status |
|------|-----|-----|-----|-----|-----|--------|
| 1.1  |     |     |     |     |     | |
| 1.7  |     |     |     |     |     | |

**Completed:** 0 points  
**Notes:**

---

### Week 2
**Target:** Complete Epics 1.2, 1.3 - 14 points

| Epic | Mon | Tue | Wed | Thu | Fri | Status |
|------|-----|-----|-----|-----|-----|--------|
| 1.2  |     |     |     |     |     | |
| 1.3  |     |     |     |     |     | |

**Completed:** 0 points  
**Notes:**

---

### Week 3
**Target:** Complete Epics 1.4, 1.5 - 10 points

| Epic | Mon | Tue | Wed | Thu | Fri | Status |
|------|-----|-----|-----|-----|-----|--------|
| 1.4  |     |     |     |     |     | |
| 1.5  |     |     |     |     |     | |

**Completed:** 0 points  
**Notes:**

---

### Week 4
**Target:** Complete Epic 1.6, final testing - 6 points

| Epic | Mon | Tue | Wed | Thu | Fri | Status |
|------|-----|-----|-----|-----|-----|--------|
| 1.6  |     |     |     |     |     | |
| Test |     |     |     |     |     | |

**Completed:** 0 points  
**Notes:**

---

## Testing Checklist

### Unit Tests Required
- [ ] Auth: password validation tests
- [ ] Auth: email validation tests
- [ ] Memorial: field validation tests
- [ ] Memorial: image validation tests
- [ ] Comment: content validation tests
- [ ] Utils: email masking tests
- [ ] Utils: date comparison tests

### Integration Tests Required
- [ ] Auth: full signup flow
- [ ] Auth: full login flow
- [ ] Auth: token generation and validation
- [ ] Memorial: create, read, update, delete
- [ ] Memorial: image handling
- [ ] Comment: create and display
- [ ] Admin: approval workflow
- [ ] Gallery: filtering and pagination

### E2E Tests Required
- [ ] User signup → login → create memorial → view gallery → comment
- [ ] Admin review memorial → approve → appears in gallery
- [ ] Link-only memorial → not in gallery → accessible by URL
- [ ] Image upload and display

### Performance Tests Required
- [ ] Homepage load: < 2s
- [ ] Gallery load: < 2s
- [ ] Memorial detail: < 1s
- [ ] API responses: < 500ms
- [ ] Image upload: handles 5MB

### Security Tests Required
- [ ] Authentication: invalid credentials rejected
- [ ] Authorization: cannot access others' memorials
- [ ] Authorization: non-admin cannot access admin
- [ ] CORS: appropriate headers set
- [ ] Input validation: XSS prevention
- [ ] SQL injection: parameterized queries used
- [ ] Password: bcrypt hashing verified
- [ ] Tokens: JWT validation working

---

## Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Docker images built
- [ ] Services start without errors
- [ ] Database connection verified
- [ ] API responding
- [ ] Frontend loads
- [ ] All 7 epics complete
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Team sign-off received

---

## Success Criteria

### Functional
- [ ] Users can sign up
- [ ] Users can log in
- [ ] Authenticated users can create memorials
- [ ] Memorial creation stores all data
- [ ] Images upload and display correctly
- [ ] Public memorials appear in gallery
- [ ] Link-only memorials are hidden from gallery
- [ ] Pending memorials don't appear publicly
- [ ] Admins can approve/reject memorials
- [ ] Approved memorials appear in gallery
- [ ] Users can comment on memorials
- [ ] Comments display chronologically
- [ ] Homepage displays all sections
- [ ] Navigation works throughout

### Non-Functional
- [ ] Page load time: < 2 seconds
- [ ] API response time: < 500ms
- [ ] Database queries: < 100ms
- [ ] 99% uptime during testing
- [ ] No critical security issues
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility: 90+ score
- [ ] Code test coverage: 80%+

### User Experience
- [ ] Clear error messages
- [ ] Intuitive navigation
- [ ] Empathetic tone
- [ ] Professional appearance
- [ ] Mobile friendly
- [ ] Loading states clear
- [ ] Success confirmations

---

## Known Issues & Notes

| Issue | Epic | Severity | Status | Solution |
|-------|------|----------|--------|----------|
| | | | | |
| | | | | |

---

## Sign-Off

**Created By:** _________________ **Date:** __________

**Reviewed By:** _________________ **Date:** __________

**Approved By:** _________________ **Date:** __________

**Milestone Started:** _________________ **Date:** __________

**Milestone Completed:** _________________ **Date:** __________

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 28, 2026 | Dev Team | Initial creation |

