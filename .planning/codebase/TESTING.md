# Testing Patterns

**Analysis Date:** 2026-01-05

## Test Framework

**Runner:**
- Not configured - No test framework installed

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
# No test commands available
# Neither client nor server package.json has a "test" script
```

## Test File Organization

**Location:**
- No test files found in codebase

**Naming:**
- Not applicable - No tests exist

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable - No tests exist

**Patterns:**
- Not established

## Mocking

**Framework:**
- Not applicable

**Patterns:**
- Not established

**What to Mock (Recommendations):**
- External API calls (if added)
- Prisma database operations
- JWT token generation
- File system operations

## Fixtures and Factories

**Test Data:**
- Seed data exists: `server/prisma/seed.js`
- Creates default admin user and service packages
- No test-specific fixtures

**Location:**
- `server/prisma/seed.js` - Database seeding

## Coverage

**Requirements:**
- No coverage requirements
- No coverage tooling configured

**Configuration:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Current QA Approach

In lieu of automated tests, the codebase relies on:

**Runtime Validation (Frontend):**
- Zod schemas in `client/src/utils/validators.js`
- React Hook Form with Zod resolver
- Error state management via Zustand

**Runtime Validation (Backend):**
- express-validator installed (but unused)
- Controller-level input checks
- Prisma schema constraints
- Error handler middleware

**Manual Testing:**
- Development server (`npm run dev`)
- Prisma Studio for database inspection (`npm run prisma:studio`)

## Recommended Test Setup

If adding tests, consider:

**Client (Vitest + React Testing Library):**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```javascript
// vitest.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
```

**Server (Vitest):**
```bash
npm install -D vitest
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

**Critical Paths to Test:**
1. `server/src/utils/jwt.utils.js` - Token generation/verification
2. `server/src/utils/password.utils.js` - Password hashing
3. `server/src/controllers/auth.controller.js` - Login flow
4. `server/src/controllers/payments.controller.js` - Financial calculations
5. `server/src/middleware/auth.middleware.js` - Auth protection
6. `client/src/store/authStore.js` - Auth state management
7. `client/src/utils/api.js` - API interceptors

---

*Testing analysis: 2026-01-05*
*Update when test patterns change*
