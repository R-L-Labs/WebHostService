# Architecture

**Analysis Date:** 2026-01-05

## Pattern Overview

**Overall:** Full-Stack Monorepo with Client-Server Architecture

**Key Characteristics:**
- Separated frontend (React SPA) and backend (Express API)
- npm workspaces monorepo structure
- REST API communication with JWT authentication
- Layered architecture with clear separation of concerns

## Layers

**Frontend Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Contains: React components, pages, layouts
- Location: `client/src/components/`, `client/src/pages/`, `client/src/layouts/`
- Depends on: State management, API layer
- Used by: End users via browser

**Frontend State Management:**
- Purpose: Manage application state with persistence
- Contains: Zustand stores (auth, clients, inquiries, UI)
- Location: `client/src/store/`
- Depends on: Nothing (standalone)
- Used by: Components, pages, API layer

**Frontend API Layer:**
- Purpose: HTTP communication with backend
- Contains: Axios instance, request/response interceptors, API modules
- Location: `client/src/utils/api.js`
- Depends on: Auth store (for JWT token)
- Used by: Components, pages, stores

**Backend Route Layer:**
- Purpose: Map HTTP methods to controller actions
- Contains: Express route definitions
- Location: `server/src/routes/`
- Depends on: Middleware, controllers
- Used by: Express app

**Backend Controller Layer:**
- Purpose: Business logic, data validation, Prisma queries
- Contains: Request handlers, CRUD operations
- Location: `server/src/controllers/`
- Depends on: Prisma client, utilities
- Used by: Route handlers

**Backend Middleware Layer:**
- Purpose: Request processing, authentication, error handling
- Contains: Auth middleware, error handler, rate limiting
- Location: `server/src/middleware/`
- Depends on: JWT utilities
- Used by: Routes

**Backend Data Layer:**
- Purpose: Database operations via Prisma ORM
- Contains: Prisma schema, migrations
- Location: `server/prisma/`
- Depends on: PostgreSQL (Supabase)
- Used by: Controllers

## Data Flow

**Authentication Flow:**

1. User submits credentials on `/admin/login`
2. Frontend calls `authAPI.login()` → POST `/api/auth/login`
3. Backend `auth.controller.js` validates credentials via bcrypt
4. JWT generated with user ID, email, role (24h expiration)
5. Token returned to client, stored in Zustand with persistence
6. Axios interceptor adds `Authorization: Bearer <token>` to requests
7. Protected routes use `ProtectedRoute` component

**API Request Flow:**

1. Component triggers API call (e.g., `clientsAPI.getAll()`)
2. Axios interceptor adds JWT from `authStore`
3. Request hits Express server at `/api/*`
4. Rate limiter checks (100 req/15min)
5. Route matches, middleware runs (`protect` verifies JWT)
6. Controller executes business logic with Prisma
7. Response returned with data or error
8. Axios interceptor handles 401 (auto-logout)
9. Component updates UI with response

**State Management:**
- Zustand stores with `persist` middleware
- Auth state survives page refresh via localStorage
- Each store is self-contained (auth, clients, inquiries, UI)

## Key Abstractions

**Services (Backend Controllers):**
- Purpose: Encapsulate business logic per domain
- Examples: `server/src/controllers/auth.controller.js`, `server/src/controllers/clients.controller.js`
- Pattern: Exported async functions, one per HTTP action

**Stores (Frontend State):**
- Purpose: Manage domain-specific state
- Examples: `client/src/store/authStore.js`, `client/src/store/clientStore.js`
- Pattern: Zustand create() with state + actions

**API Modules:**
- Purpose: Group related API calls
- Examples: `authAPI`, `clientsAPI`, `inquiriesAPI` in `client/src/utils/api.js`
- Pattern: Object with method functions

**Protected Route:**
- Purpose: Guard authenticated routes
- Location: `client/src/components/common/ProtectedRoute.jsx`
- Pattern: Wrapper component checking auth state

## Entry Points

**Server Entry:**
- Location: `server/src/server.js`
- Triggers: `npm start` or `npm run dev`
- Responsibilities: Configure Express, apply middleware, mount routes, start server

**Client Entry:**
- Location: `client/src/main.jsx`
- Triggers: Vite dev server or built bundle
- Responsibilities: Render React app to DOM

**Client Router:**
- Location: `client/src/App.jsx`
- Triggers: Client navigation
- Responsibilities: Define routes, layouts, protected areas

## Error Handling

**Strategy:** Centralized error middleware with Prisma-aware handling

**Patterns:**
- Controllers use try/catch with `next(error)`
- Global error handler in `server/src/middleware/errorHandler.middleware.js`
- Prisma error codes handled (P2002 unique, P2025 not found, etc.)
- Production hides stack traces
- Frontend shows toast notifications via Sonner

## Cross-Cutting Concerns

**Logging:**
- Console.log/error for output
- No structured logging library
- Development-only debug statements

**Validation:**
- Frontend: Zod schemas in `client/src/utils/validators.js`
- Frontend forms: React Hook Form with Zod resolver
- Backend: Basic checks in controllers (express-validator installed but unused)

**Authentication:**
- JWT tokens with 24-hour expiration
- Bearer token in Authorization header
- Role-based access (ADMIN, SUPER_ADMIN)
- `protect` middleware on all `/api/*` routes except public

**Security:**
- Helmet.js for security headers
- CORS restricted to CLIENT_URL
- Rate limiting (100 req/15min)
- Password hashing with bcryptjs

---

*Architecture analysis: 2026-01-05*
*Update when major patterns change*
