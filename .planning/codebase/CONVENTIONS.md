# Coding Conventions

**Analysis Date:** 2026-01-05

## Naming Patterns

**Files:**
- `PascalCase.jsx` - React page components (`LoginPage.jsx`, `DashboardPage.jsx`)
- `kebab-case.jsx` - UI components (`button.jsx`, `card.jsx`, `input.jsx`)
- `camelCase.js` - Stores and utilities (`authStore.js`, `helpers.js`)
- `{feature}.controller.js` - Backend controllers
- `{feature}.routes.js` - Backend routes
- `{name}.middleware.js` - Middleware
- `{name}.utils.js` - Utility modules

**Functions:**
- camelCase for all functions
- No special prefix for async functions
- `handle{Event}` for event handlers (`handleClick`, `handleSubmit`)
- Verb + noun for controllers (`getClients`, `createClient`, `updateClient`)

**Variables:**
- camelCase for variables
- UPPER_SNAKE_CASE for constants (not consistently applied)
- No underscore prefix for private members

**Types:**
- No TypeScript - plain JavaScript throughout
- JSDoc comments for function signatures (server-side)

## Code Style

**Formatting:**
- 2 space indentation
- Semicolons required
- Single quotes for strings
- No trailing commas in single-line
- Clean separation between imports, logic, exports

**Linting:**
- ESLint 9.x with flat config - `client/eslint.config.js`
- Extends: `js.configs.recommended`, React plugins
- No Prettier configured (manual formatting)
- Run: `npm run lint` (client only)

## Import Organization

**Order:**
1. React and React libraries
2. External packages (axios, zustand, lucide-react)
3. Internal modules (@/components, @/store)
4. Relative imports (./utils, ../types)

**Grouping:**
- No enforced blank lines between groups
- Alphabetical within groups (not enforced)

**Path Aliases:**
- None configured - relative imports used

## Error Handling

**Patterns:**
- Backend: try/catch with `next(error)` for Express
- Frontend: try/catch with toast notifications
- Centralized error middleware in `server/src/middleware/errorHandler.middleware.js`

**Error Types:**
- Prisma errors handled by code (P2002, P2025, etc.)
- HTTP status codes: 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 500 (server)
- Production hides stack traces

**Async:**
- async/await pattern throughout
- No .catch() chains

## Logging

**Framework:**
- console.log/console.error only
- No structured logging library

**Patterns:**
- Server startup messages
- Error logging in middleware
- Development debug statements (should be removed)

**Where:**
- `server/src/server.js` - Startup logging
- `server/src/middleware/errorHandler.middleware.js` - Error logging

## Comments

**When to Comment:**
- JSDoc for API route documentation (server)
- Inline comments for complex logic (minimal)
- No comment style for React components

**JSDoc (Server-side):**
```javascript
/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
```

**TODO Comments:**
- None found in codebase

## Function Design

**Size:**
- No strict limit observed
- Controllers can be 50-100+ lines

**Parameters:**
- Express handlers: `(req, res, next)`
- Utility functions: Descriptive parameters
- Object destructuring for multiple params

**Return Values:**
- Controllers return `res.json()` or `res.status().json()`
- Utilities return explicit values
- Early returns for guard clauses

## Module Design

**Exports:**
- Named exports for controllers and utilities
- Default exports for React components
- Zustand stores export via `create()`

**Barrel Files:**
- Routes aggregated in `server/src/routes/index.js`
- No barrel files for components

**API Client Pattern:**
```javascript
// client/src/utils/api.js
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};
```

**Store Pattern:**
```javascript
// Zustand store with persistence
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

**Controller Pattern:**
```javascript
// Async function with try/catch
export const getClients = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany();
    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};
```

---

*Convention analysis: 2026-01-05*
*Update when patterns change*
