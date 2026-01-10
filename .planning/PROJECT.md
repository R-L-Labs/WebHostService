# WebHostService

## Milestones

### ✅ v1.0 Hardening (Complete)

Made the codebase production-safe with input validation, tests, structured logging, and soft deletes.

### 🚧 v1.1 Supabase Migration (Current)

## What This Is

Migration from Express + Prisma backend to direct Supabase access from the React frontend. This eliminates the need for a Node.js server, enabling deployment as a static site on Netlify.

## Core Value

**Enable simple static site deployment** - Remove backend complexity by leveraging Supabase's built-in auth and database access.

## Requirements

### Validated

<!-- Capabilities from v1.0 that remain -->

- ✓ Client CRUD with pagination and filtering
- ✓ Inquiry management with status workflow
- ✓ Payment tracking per client
- ✓ Service package management
- ✓ User management for Super Admins
- ✓ Public contact form submission
- ✓ React SPA with Zustand state management
- ✓ PostgreSQL database (Supabase)
- ✓ Soft deletes on Client, Payment, Inquiry

### Active

<!-- v1.1 Migration scope -->

**Phase 7 - Supabase Setup:**
- [ ] Install @supabase/supabase-js client
- [ ] Create Supabase client utility
- [ ] Design RLS policies for all tables
- [ ] Implement and test RLS policies

**Phase 8 - Auth Migration:**
- [ ] Configure Supabase Auth
- [ ] Migrate existing users to Supabase Auth
- [ ] Link auth.users to public.users
- [ ] Update authStore for Supabase sessions
- [ ] Implement role-based access

**Phase 9 - Database Access:**
- [ ] Create Supabase query utilities
- [ ] Handle soft deletes in queries
- [ ] Ensure decimal handling for payments

**Phase 10 - Frontend Refactor:**
- [ ] Replace axios with Supabase client
- [ ] Update all Zustand stores
- [ ] Test all user flows

**Phase 11 - Backend Removal:**
- [ ] Remove server workspace
- [ ] Delete server directory
- [ ] Create netlify.toml
- [ ] Deploy to Netlify

### Out of Scope

- Email notifications
- Real-time subscriptions (Supabase supports this, but not needed now)
- Additional features beyond migration

## Context

The existing Express backend serves as a thin API layer between React and Supabase/PostgreSQL. Since Supabase provides:
- Built-in authentication
- Row Level Security for authorization
- Direct database access from client

The backend can be eliminated entirely, simplifying deployment and maintenance.

**Current architecture:**
```
React → axios → Express → Prisma → PostgreSQL (Supabase)
```

**Target architecture:**
```
React → @supabase/supabase-js → PostgreSQL (Supabase)
```

**Existing data to preserve:**
- Users table (needs migration to Supabase Auth)
- Clients, Payments, Inquiries, Packages tables (keep as-is)

## Constraints

- **Data Preservation**: Existing users and data must be migrated, not recreated
- **Password Migration**: Supabase Auth uses different hashing; may need password reset flow
- **RLS Security**: Row Level Security must match current API authorization logic

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase Auth over custom JWT | Simplifies auth, handles sessions/tokens automatically | Active |
| Keep existing data | Production data exists, fresh start not viable | Active |
| Netlify for hosting | Simple static site deployment, good free tier | Planned |
| Password reset for migrated users | Supabase uses different hash algorithm than bcrypt | TBD |

---
*Last updated: 2026-01-09 — v1.1 milestone initialized*
