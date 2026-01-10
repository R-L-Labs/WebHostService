# Phase 7: Supabase Setup - Context

**Gathered:** 2026-01-09
**Status:** Ready for planning

<vision>
## How This Should Work

The Supabase database is already set up and running. This phase is about connecting the frontend directly to that existing database, not creating anything new.

Auth works fully through Supabase — admins log in via Supabase Auth, and that's what gates access to everything. The website connects directly to Supabase instead of going through the Express backend.

Keep everything as-is on the database side. Just wire up the connection.

</vision>

<essential>
## What Must Be Nailed

- **Working auth flow** - Admins can log in and stay logged in via Supabase Auth
- **Data stays secure** - RLS ensures only authenticated admins can access data
- **Existing data intact** - Nothing breaks or gets lost in the transition

All three are equally important — can't ship without all of them working.

</essential>

<boundaries>
## What's Out of Scope

- Public-facing changes — the public website stays the same for now
- New features — this is purely about connecting to what exists
- Changing the database schema — keep existing structure

</boundaries>

<specifics>
## Specific Ideas

- Database already exists on Supabase, just need to connect
- Admin-only access (no public user accounts)
- Two roles to support: ADMIN and SUPER_ADMIN (existing pattern)

</specifics>

<notes>
## Additional Context

This is a migration phase, not a greenfield setup. The goal is to swap out the transport layer (Express → Supabase client) while keeping everything else working identically.

</notes>

---

*Phase: 07-supabase-setup*
*Context gathered: 2026-01-09*
