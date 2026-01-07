# WebHostService Hardening

## What This Is

A comprehensive cleanup and hardening effort for the WebHostService platform - a full-stack web hosting service management application with React frontend and Express backend. This milestone focuses on fixing all identified technical debt, security gaps, and code quality issues to make the codebase production-ready.

## Core Value

**Make the codebase production-safe and maintainable** - every API endpoint validates input, critical paths have tests, and code follows consistent patterns.

## Requirements

### Validated

<!-- Existing capabilities that work and are relied upon -->

- ✓ JWT authentication with role-based access (ADMIN, SUPER_ADMIN) — existing
- ✓ Client CRUD with pagination and filtering — existing
- ✓ Inquiry management with status workflow (NEW → CONTACTED → QUALIFIED → CONVERTED) — existing
- ✓ Payment tracking per client — existing
- ✓ Service package management — existing
- ✓ User management for Super Admins — existing
- ✓ Public contact form submission — existing
- ✓ React SPA with Zustand state management — existing
- ✓ Prisma ORM with PostgreSQL (Supabase) — existing
- ✓ Rate limiting and CORS protection — existing

### Active

<!-- Current scope - the cleanup work -->

**High Priority:**
- [ ] Add input validation middleware to all API endpoints (express-validator)
- [ ] Add UUID validation for route parameters
- [ ] Strengthen password requirements (12+ chars, complexity)
- [ ] Set up test framework (Vitest)
- [ ] Write tests for critical paths (auth, payments, JWT utils)

**Medium Priority:**
- [ ] Fix N+1 query pattern in inquiries controller
- [ ] Add database indexes on frequently queried fields
- [ ] Replace console.log with structured logging (Pino)
- [ ] Add try/catch to JSON.parse calls in packages controller
- [ ] Fix floating point currency calculations (use decimal.js)

**Low Priority:**
- [ ] Add client-side role checking to ProtectedRoute
- [ ] Implement soft deletes with audit trail
- [ ] Clean up unused dependencies

### Out of Scope

<!-- Explicit boundaries -->

- Email notifications (SendGrid/Nodemailer) — feature addition, not a fix
- Redis caching layer — scaling concern for future milestone
- Token refresh mechanism — works currently, enhancement for later
- CI/CD pipeline — separate infrastructure concern

## Context

This is a brownfield cleanup of an existing, functional application. The codebase has good architecture and separation of concerns, but was developed rapidly without:
- Input validation on API routes (express-validator installed but unused)
- Automated tests
- Production-grade logging
- Database query optimization

The concerns were identified via codebase analysis (see `.planning/codebase/CONCERNS.md`).

**Existing infrastructure:**
- Monorepo with npm workspaces (client + server)
- React 19 + Vite + Tailwind (frontend)
- Express 5 + Prisma + PostgreSQL/Supabase (backend)
- JWT authentication with bcrypt password hashing

## Constraints

- **API Compatibility**: Existing request/response contracts should not change (avoid breaking clients)
- **Tech Stack**: Use existing dependencies where possible (express-validator already installed)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vitest over Jest | Vite already in stack, faster, better ESM support | — Pending |
| Pino over Winston | Lighter weight, better performance, JSON by default | — Pending |
| decimal.js for currency | Industry standard, precise decimal arithmetic | — Pending |

---
*Last updated: 2026-01-05 after initialization*
