# Testing & Documentation Tracking

**Status:** Planning Phase  
**Last Updated:** January 28, 2026

---

## Testing Requirements by Epic

### Epic 1.1: Authentication & User Management ✅

**Status:** Implemented | **Testing:** Pending | **Docs:** Pending

**Unit Tests Required:**
- [ ] Password validation: min length, uppercase, lowercase, number, special char
- [ ] Email validation: format, invalid patterns
- [ ] Password hashing: bcrypt produces different hashes
- [ ] Token generation: payload structure, expiration time
- [ ] Token decoding: valid tokens, expired tokens, invalid tokens

**Integration Tests Required:**
- [ ] Registration flow: valid email/password → user created
- [ ] Registration duplicate email: prevents duplicate
- [ ] Login flow: valid credentials → token returned
- [ ] Login invalid credentials: wrong password/email rejected
- [ ] Login user not found: handles missing user gracefully
- [ ] Get current user: valid token → user data returned
- [ ] Get current user unauthorized: no token → 401 error
- [ ] Logout: successful response

**E2E Tests Required:**
- [ ] Full registration → login → get user → logout flow
- [ ] Password strength enforcement in registration
- [ ] Email uniqueness enforcement

**Documentation:**
- [ ] API endpoint docs (swagger/openapi)
- [ ] JWT token structure and expiration
- [ ] Password requirements specification
- [ ] Error codes and responses
- [ ] Security considerations

---

### Epic 1.2: Core Memorial Creation Workflow

**Status:** In Progress | **Testing:** To Plan | **Docs:** To Write

**Unit Tests Required:**
- [ ] Date validation: birth_date <= death_date
- [ ] Privacy enum validation: public/link-only
- [ ] Status enum validation: pending/approved/rejected
- [ ] Field length validation: name (1-255), story (max 10000)
- [ ] Image validation: format, size, MIME type

**Integration Tests Required:**
- [ ] Create memorial: authenticated user → memorial created
- [ ] Create memorial unauthorized: no auth → 401
- [ ] Create memorial with images: upload and process images
- [ ] Update memorial: owner can update
- [ ] Update memorial unauthorized: non-owner cannot update
- [ ] Delete memorial: owner can delete
- [ ] Delete memorial unauthorized: non-owner cannot delete
- [ ] Cascade delete: images deleted with memorial

**E2E Tests Required:**
- [ ] Full memorial lifecycle: create → read → update → delete
- [ ] Image upload and processing
- [ ] Privacy setting enforcement

**Documentation:**
- [ ] Memorial creation workflow
- [ ] File upload specifications
- [ ] Image processing pipeline
- [ ] Database schema updates
- [ ] Error handling guide

---

### Epic 1.3: Memorial Gallery & Discovery

**Status:** Not Started | **Testing:** To Plan | **Docs:** To Write

**Unit Tests Required:**
- [ ] Search query parsing and validation
- [ ] Pagination offset calculation
- [ ] Sorting logic (newest first)
- [ ] Privacy filter logic

**Integration Tests Required:**
- [ ] List memorials: returns public memorials
- [ ] List memorials pagination: page limits work
- [ ] List memorials search: finds by name
- [ ] List memorials search case-insensitive: case ignored
- [ ] List memorials private: excludes link-only
- [ ] Get memorial detail: returns full data
- [ ] Get memorial detail not found: 404
- [ ] Get memorial privacy enforced: public accessible, link-only blocked

**E2E Tests Required:**
- [ ] Browse gallery, search, view detail
- [ ] Pagination navigation
- [ ] Search results accuracy

**Documentation:**
- [ ] Gallery feature overview
- [ ] Search functionality
- [ ] Pagination spec
- [ ] Privacy model explanation

---

### Epic 1.4: Basic Comment System

**Status:** Not Started | **Testing:** To Plan | **Docs:** To Write

**Unit Tests Required:**
- [ ] Comment text validation: not empty, max length
- [ ] Comment ordering: chronological
- [ ] Email masking: partial email shown

**Integration Tests Required:**
- [ ] Create comment: authenticated user → comment created
- [ ] Create comment unauthorized: no auth → 401
- [ ] List comments: pagination works
- [ ] List comments ordering: oldest first
- [ ] Delete comment: creator can delete
- [ ] Delete comment unauthorized: non-creator cannot delete

**E2E Tests Required:**
- [ ] Add comment to memorial, see it in list
- [ ] Delete own comment
- [ ] Comment persistence

**Documentation:**
- [ ] Commenting workflow
- [ ] Privacy and anonymization
- [ ] Comment moderation approach

---

### Epic 1.5: Charity Integration

**Status:** Not Started | **Testing:** To Plan | **Docs:** To Write

**Unit Tests Required:**
- [ ] Charity URL validation: http/https format
- [ ] Charity active status filtering

**Integration Tests Required:**
- [ ] List charities: returns active charities
- [ ] List charities pagination: works correctly
- [ ] Get charity detail: returns data
- [ ] Associate charity: add to memorial
- [ ] List memorial charities: returns associations

**E2E Tests Required:**
- [ ] Create memorial with charities
- [ ] Update memorial charities
- [ ] View charities on memorial

**Documentation:**
- [ ] Charity integration workflow
- [ ] Charity model structure
- [ ] URL validation requirements

---

### Epic 1.6: Admin Moderation Dashboard

**Status:** Not Started | **Testing:** To Plan | **Docs:** To Write

**Unit Tests Required:**
- [ ] Admin role checking
- [ ] Approval status updates
- [ ] Rejection with reasoning

**Integration Tests Required:**
- [ ] List pending memorials: admin only
- [ ] Approve memorial: admin can approve
- [ ] Reject memorial: admin can reject
- [ ] Flag comment: moderation works
- [ ] List flagged comments: shows for review

**E2E Tests Required:**
- [ ] Admin workflow: review pending, approve/reject
- [ ] Moderation actions reflect in live system

**Documentation:**
- [ ] Admin dashboard features
- [ ] Moderation workflow
- [ ] Admin panel user guide

---

### Epic 1.7: Pro Plan Mocking

**Status:** Not Started | **Testing:** To Plan | **Docs:** To Write

**Unit Tests Required:**
- [ ] is_pro flag behavior
- [ ] Feature flag checking

**Integration Tests Required:**
- [ ] Pro user can add images to comments
- [ ] Free user cannot add images to comments
- [ ] Pro features accessible when flagged

**E2E Tests Required:**
- [ ] Pro features enabled/disabled correctly
- [ ] Feature gates work properly

**Documentation:**
- [ ] Pro features specification
- [ ] Feature flag system
- [ ] Future monetization roadmap

---

## Documentation Deliverables

### For Each Epic:

**Technical Documentation:**
- API endpoint specifications (all endpoints)
- Request/response schema examples
- Error codes and messages
- Authentication requirements
- Database schema changes
- Code architecture decisions

**High-Level Documentation:**
- Feature overview and use cases
- User workflows (step-by-step)
- Business rules and constraints
- Integration points
- Known limitations

**Files Generated:**
- `EPIC_X_IMPLEMENTATION.md`: Technical deep dive
- `EPIC_X_USER_GUIDE.md`: User-facing workflow (when applicable)

---

## Testing Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Unit test coverage | 80%+ | 0% |
| Integration test coverage | 70%+ | 0% |
| API endpoint coverage | 100% | 0% |
| E2E critical flows | 100% | 0% |

---

## Testing Execution

### Local Testing
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run E2E tests
pytest tests/e2e/ -v
```

### CI/CD Integration (Future)
- GitHub Actions workflow
- Automated test runs on PR
- Coverage reporting
- Test result artifacts

---

## Documentation Maintenance

**Update frequency:** After each epic completion

**Review process:**
1. Technical review by another developer
2. Spelling/grammar check
3. Example verification
4. Link validation

**Version control:** Git track all .md files
