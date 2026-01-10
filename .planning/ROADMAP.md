# Roadmap: WebHostService

## Milestones

- ✅ **v1.0 Hardening** - Phases 1-6 (shipped 2026-01-06)
- ✅ **v1.1 Supabase Migration** - Phases 7-11 (shipped 2026-01-10)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>✅ v1.0 Hardening (Phases 1-6) - SHIPPED 2026-01-06</summary>

- [x] **Phase 1: API Validation** - Add input validation middleware to all API endpoints
- [x] **Phase 2: Test Infrastructure** - Set up Vitest and write tests for critical paths
- [x] **Phase 3: Security Hardening** - Strengthen password requirements and add role checks
- [x] **Phase 4: Database Optimization** - Fix N+1 queries and add indexes
- [x] **Phase 5: Code Quality** - Structured logging, error handling, currency fixes
- [x] **Phase 6: Cleanup** - Soft deletes, audit trail, dependency cleanup

### Phase 1: API Validation
**Goal**: Every API endpoint validates and sanitizes input before processing
**Plans**: 3/3 complete

### Phase 2: Test Infrastructure
**Goal**: Vitest configured with tests covering critical authentication and payment paths
**Plans**: 3/3 complete

### Phase 3: Security Hardening
**Goal**: Stronger authentication with proper password policies and client-side role checks
**Plans**: 2/2 complete

### Phase 4: Database Optimization
**Goal**: Efficient queries with proper indexing
**Plans**: 1/1 complete

### Phase 5: Code Quality
**Goal**: Production-grade logging, proper error handling, accurate currency math
**Plans**: 2/2 complete

### Phase 6: Cleanup
**Goal**: Clean, maintainable codebase with data retention
**Plans**: 2/2 complete

</details>

<details>
<summary>✅ v1.1 Supabase Migration (Phases 7-11) - SHIPPED 2026-01-10</summary>

**Milestone Goal:** Remove Express backend and migrate to direct Supabase access, enabling static site deployment to Netlify.

- [x] **Phase 7: Supabase Setup** - Initialize client SDK, configure Row Level Security
- [x] **Phase 8: Auth Migration** - Replace custom JWT with Supabase Auth
- [x] **Phase 9: Database Access** - Convert API calls to direct Supabase queries
- [x] **Phase 10: Frontend Refactor** - Update stores and components for Supabase
- [x] **Phase 11: Backend Removal** - Remove server, configure Netlify deployment

### Phase 7: Supabase Setup
**Goal**: Supabase client configured with RLS policies protecting all tables
**Plans**: 2/2 complete

### Phase 8: Auth Migration
**Goal**: Users authenticate via Supabase Auth with existing data preserved
**Plans**: 3/3 complete

### Phase 9: Database Access
**Goal**: All CRUD operations work directly through Supabase client
**Plans**: 2/2 complete

### Phase 10: Frontend Refactor
**Goal**: React app works entirely with Supabase, no Express dependency
**Plans**: 3/3 complete

### Phase 11: Backend Removal
**Goal**: Server directory removed, app deployed to Netlify
**Plans**: 1/1 complete

</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. API Validation | v1.0 | 3/3 | Complete | 2026-01-05 |
| 2. Test Infrastructure | v1.0 | 3/3 | Complete | 2026-01-05 |
| 3. Security Hardening | v1.0 | 2/2 | Complete | 2026-01-06 |
| 4. Database Optimization | v1.0 | 1/1 | Complete | 2026-01-06 |
| 5. Code Quality | v1.0 | 2/2 | Complete | 2026-01-06 |
| 6. Cleanup | v1.0 | 2/2 | Complete | 2026-01-06 |
| 7. Supabase Setup | v1.1 | 2/2 | Complete | 2026-01-10 |
| 8. Auth Migration | v1.1 | 3/3 | Complete | 2026-01-10 |
| 9. Database Access | v1.1 | 2/2 | Complete | 2026-01-10 |
| 10. Frontend Refactor | v1.1 | 3/3 | Complete | 2026-01-10 |
| 11. Backend Removal | v1.1 | 1/1 | Complete | 2026-01-10 |

**All milestones complete. Ready for production deployment.**
