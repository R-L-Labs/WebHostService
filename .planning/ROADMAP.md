# Roadmap: WebHostService

## Milestones

- ✅ **v1.0 Hardening** - Phases 1-6 (shipped 2026-01-06)
- 🚧 **v1.1 Supabase Migration** - Phases 7-11 (in progress)

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

### 🚧 v1.1 Supabase Migration (In Progress)

**Milestone Goal:** Remove Express backend and migrate to direct Supabase access, enabling static site deployment to Netlify.

- [ ] **Phase 7: Supabase Setup** - Initialize client SDK, configure Row Level Security
- [ ] **Phase 8: Auth Migration** - Replace custom JWT with Supabase Auth
- [ ] **Phase 9: Database Access** - Convert API calls to direct Supabase queries
- [ ] **Phase 10: Frontend Refactor** - Update stores and components for Supabase
- [ ] **Phase 11: Backend Removal** - Remove server, configure Netlify deployment

## Phase Details

### Phase 7: Supabase Setup
**Goal**: Supabase client configured with RLS policies protecting all tables
**Depends on**: Phase 6 (hardening complete)
**Research**: Likely (Supabase RLS patterns, client SDK setup)
**Research topics**: Supabase JS client v2, RLS policy syntax, role-based access patterns
**Plans**: TBD

Key work:
- Install @supabase/supabase-js in client
- Create Supabase client utility
- Design and implement RLS policies for all tables (User, Client, Payment, Inquiry, Package)
- Test RLS policies work correctly

### Phase 8: Auth Migration
**Goal**: Users authenticate via Supabase Auth with existing data preserved
**Depends on**: Phase 7
**Research**: Likely (Supabase Auth, user migration)
**Research topics**: Supabase Auth hooks, migrating existing bcrypt passwords, auth state management
**Plans**: TBD

Key work:
- Set up Supabase Auth in project
- Migrate existing users to Supabase Auth (handle password migration)
- Link auth.users to public.users table
- Update authStore to use Supabase session
- Implement role-based access using Supabase custom claims or profiles table

### Phase 9: Database Access
**Goal**: All CRUD operations work directly through Supabase client
**Depends on**: Phase 8
**Research**: Unlikely (standard Supabase queries)
**Plans**: TBD

Key work:
- Create Supabase query utilities for each entity (clients, payments, inquiries, packages)
- Handle soft deletes in queries
- Ensure decimal handling for payments
- Test all operations match current behavior

### Phase 10: Frontend Refactor
**Goal**: React app works entirely with Supabase, no Express dependency
**Depends on**: Phase 9
**Research**: Unlikely (React patterns)
**Plans**: TBD

Key work:
- Update api.js to use Supabase client instead of axios
- Update all stores (authStore, clientStore, inquiryStore)
- Update components that directly call API
- Remove axios dependency
- Test all user flows work

### Phase 11: Backend Removal
**Goal**: Server directory removed, app deployed to Netlify
**Depends on**: Phase 10
**Research**: Likely (Netlify deployment)
**Research topics**: Netlify deployment config, environment variables, SPA routing
**Plans**: TBD

Key work:
- Remove server workspace from package.json
- Delete server directory
- Create netlify.toml with SPA redirect rules
- Configure environment variables for Supabase
- Deploy to Netlify
- Verify production works

## Progress

**Execution Order:**
Phases execute in numeric order: 7 → 8 → 9 → 10 → 11

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. API Validation | v1.0 | 3/3 | Complete | 2026-01-05 |
| 2. Test Infrastructure | v1.0 | 3/3 | Complete | 2026-01-05 |
| 3. Security Hardening | v1.0 | 2/2 | Complete | 2026-01-06 |
| 4. Database Optimization | v1.0 | 1/1 | Complete | 2026-01-06 |
| 5. Code Quality | v1.0 | 2/2 | Complete | 2026-01-06 |
| 6. Cleanup | v1.0 | 2/2 | Complete | 2026-01-06 |
| 7. Supabase Setup | v1.1 | 1/2 | In progress | - |
| 8. Auth Migration | v1.1 | 0/TBD | Not started | - |
| 9. Database Access | v1.1 | 0/TBD | Not started | - |
| 10. Frontend Refactor | v1.1 | 0/TBD | Not started | - |
| 11. Backend Removal | v1.1 | 0/TBD | Not started | - |
