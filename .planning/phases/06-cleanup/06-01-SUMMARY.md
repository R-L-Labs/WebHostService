---
phase: 06-cleanup
plan: 01
subsystem: database, controllers
tags: [soft-delete, data-retention, prisma]

# Dependency graph
requires:
  - phase: 05-code-quality
    provides: Production-grade logging and error handling
provides:
  - Soft delete capability for Client, Payment, Inquiry
  - Data retention instead of permanent deletion
affects: [clients, payments, inquiries, database]

# Tech tracking
tech-stack:
  added: []
  patterns: [Soft delete with deletedAt timestamp]

key-files:
  created: []
  modified:
    - server/prisma/schema.prisma
    - server/src/controllers/clients.controller.js
    - server/src/controllers/payments.controller.js
    - server/src/controllers/inquiries.controller.js
    - server/src/test/mocks/prisma.js
    - server/src/controllers/payments.controller.test.js

key-decisions:
  - "Soft delete via deletedAt timestamp (not isDeleted boolean)"
  - "Excluded User and Package models (admin data)"
  - "Use findFirst instead of findUnique to enable compound where"

patterns-established:
  - "Add deletedAt: null to all list queries"
  - "Use findFirst with { id, deletedAt: null } for single records"
  - "Check record exists AND not deleted before soft-deleting"

issues-created: []

# Metrics
duration: 5 min
completed: 2026-01-06
---

# Phase 6 Plan 1: Soft Deletes Summary

**Replaced hard deletes with soft deletes using deletedAt timestamp**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-06T20:58:00Z
- **Completed:** 2026-01-06T21:03:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added deletedAt field to Client, Payment, Inquiry models
- Replaced hard deletes with soft deletes (set deletedAt timestamp)
- Updated all get/list queries to filter deleted records
- Updated test mocks to support findFirst
- All 37 tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Add deletedAt to schema** - `b9db347` (feat)
2. **Task 2: Update controllers for soft delete** - `755f191` (refactor)
3. **Task 3: Filter soft-deleted from queries** - `86ba10f` (refactor)

**Plan metadata:** (pending)

## Files Created/Modified

- `server/prisma/schema.prisma` - Added deletedAt to Client, Payment, Inquiry
- `server/src/controllers/clients.controller.js` - Soft delete + filtering
- `server/src/controllers/payments.controller.js` - Soft delete + filtering
- `server/src/controllers/inquiries.controller.js` - Soft delete + filtering
- `server/src/test/mocks/prisma.js` - Added findFirst mock
- `server/src/controllers/payments.controller.test.js` - Updated to use findFirst

## Soft Delete Pattern

```javascript
// Delete operation (sets timestamp instead of removing)
await prisma.client.update({
  where: { id },
  data: { deletedAt: new Date() },
});

// Query operations (filter deleted records)
const client = await prisma.client.findFirst({
  where: { id, deletedAt: null },
});
```

## Database Migration Note

The deletedAt columns are defined but need to be applied:
```bash
cd server && npx prisma db push
```

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Test failures due to missing findFirst mock - resolved by adding to prisma.js

## Next Step

Continue with Plan 2: Final review and milestone completion

`/gsd:execute-plan .planning/phases/06-cleanup/06-02-PLAN.md`

---
*Phase: 06-cleanup*
*Plan 1 of 2 complete*
