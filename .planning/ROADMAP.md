# Roadmap: WebHostService Hardening

## Overview

Transform the WebHostService codebase from a functional prototype into a production-ready application. This milestone addresses all technical debt, security gaps, and code quality issues identified in the codebase analysis, working through concerns in priority order (High → Medium → Low).

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: API Validation** - Add input validation middleware to all API endpoints
- [ ] **Phase 2: Test Infrastructure** - Set up Vitest and write tests for critical paths
- [ ] **Phase 3: Security Hardening** - Strengthen password requirements and add role checks
- [ ] **Phase 4: Database Optimization** - Fix N+1 queries and add indexes
- [ ] **Phase 5: Code Quality** - Structured logging, error handling, currency fixes
- [ ] **Phase 6: Cleanup** - Soft deletes, audit trail, dependency cleanup

## Phase Details

### Phase 1: API Validation
**Goal**: Every API endpoint validates and sanitizes input before processing
**Depends on**: Nothing (first phase)
**Research**: Unlikely (express-validator already installed)
**Plans**: 3

Key work:
- Plan 1: Create validation infrastructure (middleware, UUID validator, query validators)
- Plan 2: Add validators to auth, clients, and inquiries routes (14 endpoints)
- Plan 3: Add validators to packages, payments, and users routes (9 endpoints)

### Phase 2: Test Infrastructure
**Goal**: Vitest configured with tests covering critical authentication and payment paths
**Depends on**: Phase 1
**Research**: Level 1 (Quick - Vitest ESM setup is straightforward)
**Plans**: 3

Key work:
- Plan 1: Vitest setup + JWT utility tests (2 tasks)
- Plan 2: Password utility tests + Prisma mock + Auth controller tests (3 tasks)
- Plan 3: Payments controller tests + Phase completion (3 tasks)

### Phase 3: Security Hardening
**Goal**: Stronger authentication with proper password policies and client-side role checks
**Depends on**: Phase 2 (tests should cover auth before modifying)
**Research**: Unlikely (established patterns)
**Plans**: TBD

Key work:
- Strengthen password requirements (12+ chars, complexity)
- Add client-side role prop to ProtectedRoute component
- Review and tighten any remaining security gaps

### Phase 4: Database Optimization
**Goal**: Efficient queries with proper indexing
**Depends on**: Phase 3
**Research**: Unlikely (Prisma patterns known)
**Plans**: TBD

Key work:
- Fix N+1 query pattern in inquiries.controller.js
- Add database indexes on User.email, Client.email, Inquiry.email, Inquiry.status
- Run migration and verify performance

### Phase 5: Code Quality
**Goal**: Production-grade logging, proper error handling, accurate currency math
**Depends on**: Phase 4
**Research**: Likely (Pino setup, decimal.js integration)
**Research topics**: Pino logger configuration, decimal.js for currency, Express error handling patterns
**Plans**: TBD

Key work:
- Replace console.log with Pino structured logging
- Add try/catch to JSON.parse calls in packages.controller.js
- Fix floating point currency calculations with decimal.js
- Ensure consistent error handling patterns

### Phase 6: Cleanup
**Goal**: Clean, maintainable codebase with audit capabilities
**Depends on**: Phase 5
**Research**: Unlikely (standard patterns)
**Plans**: TBD

Key work:
- Implement soft deletes with deletedAt timestamp
- Add audit trail for data changes
- Remove unused dependencies from package.json
- Final code review and cleanup

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. API Validation | 3/3 | Complete | 2026-01-05 |
| 2. Test Infrastructure | 2/3 | In progress | - |
| 3. Security Hardening | 0/TBD | Not started | - |
| 4. Database Optimization | 0/TBD | Not started | - |
| 5. Code Quality | 0/TBD | Not started | - |
| 6. Cleanup | 0/TBD | Not started | - |
