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
- [x] **Phase 2: Test Infrastructure** - Set up Vitest and write tests for critical paths
- [x] **Phase 3: Security Hardening** - Strengthen password requirements and add role checks
- [x] **Phase 4: Database Optimization** - Fix N+1 queries and add indexes
- [x] **Phase 5: Code Quality** - Structured logging, error handling, currency fixes
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
**Plans**: 2

Key work:
- Plan 1: Create password validation utility with complexity rules (12+ chars, upper, lower, number, special)
- Plan 2: Add allowedRoles prop to ProtectedRoute component

### Phase 4: Database Optimization
**Goal**: Efficient queries with proper indexing
**Depends on**: Phase 3
**Research**: Unlikely (Prisma patterns known)
**Plans**: 1

Key work:
- Plan 1: Optimize getInquiries queries + add Inquiry indexes (email, status)

### Phase 5: Code Quality
**Goal**: Production-grade logging, proper error handling, accurate currency math
**Depends on**: Phase 4
**Research**: Level 1 (Quick - established patterns)
**Plans**: 2

Key work:
- Plan 1: Pino structured logging (install, logger utility, replace console.log/error)
- Plan 2: Error handling + currency fixes (safe JSON.parse, decimal.js for payments)

### Phase 6: Cleanup
**Goal**: Clean, maintainable codebase with data retention
**Depends on**: Phase 5
**Research**: Level 0 (Skip - standard patterns)
**Plans**: 2

Key work:
- Plan 1: Soft deletes for Client, Payment, Inquiry (deletedAt timestamp)
- Plan 2: Final review and milestone completion

Note: Audit trail deferred to future milestone (scope too large for cleanup).

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. API Validation | 3/3 | Complete | 2026-01-05 |
| 2. Test Infrastructure | 3/3 | Complete | 2026-01-05 |
| 3. Security Hardening | 2/2 | Complete | 2026-01-06 |
| 4. Database Optimization | 1/1 | Complete | 2026-01-06 |
| 5. Code Quality | 2/2 | Complete | 2026-01-06 |
| 6. Cleanup | 0/2 | Planning complete | - |
