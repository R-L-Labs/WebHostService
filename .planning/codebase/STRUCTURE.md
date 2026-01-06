# Codebase Structure

**Analysis Date:** 2026-01-05

## Directory Layout

```
WebHostService/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── layouts/        # Layout wrapper components
│   │   ├── store/          # Zustand state stores
│   │   └── utils/          # Helpers, API, validators
│   ├── public/             # Static assets
│   ├── .env.example        # Environment template
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind theme
│   └── package.json        # Frontend dependencies
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── migrations/     # Database migrations
│   │   └── seed.js         # Seed data script
│   ├── .env.example        # Environment template
│   └── package.json        # Backend dependencies
├── package.json            # Root monorepo config
└── README.md               # Documentation
```

## Directory Purposes

**client/src/components/**
- Purpose: Reusable React components
- Contains: UI primitives, shared components
- Key files: `ui/button.jsx`, `ui/card.jsx`, `ui/input.jsx`, `common/ProtectedRoute.jsx`
- Subdirectories: `ui/` (design system), `common/` (shared logic)

**client/src/pages/**
- Purpose: Route-based page components
- Contains: Full page layouts tied to routes
- Key files: `admin/DashboardPage.jsx`, `admin/ClientsPage.jsx`, `public/HomePage.jsx`
- Subdirectories: `admin/` (protected), `public/` (marketing)

**client/src/layouts/**
- Purpose: Layout wrapper components
- Contains: Shared page structure (nav, sidebar, footer)
- Key files: `AdminLayout.jsx`, `PublicLayout.jsx`

**client/src/store/**
- Purpose: Zustand state management
- Contains: Domain-specific stores with persistence
- Key files: `authStore.js`, `clientStore.js`, `inquiryStore.js`, `uiStore.js`

**client/src/utils/**
- Purpose: Shared utilities and helpers
- Contains: API client, formatters, validators, constants
- Key files: `api.js`, `helpers.js`, `validators.js`, `constants.js`

**server/src/controllers/**
- Purpose: Business logic and request handlers
- Contains: CRUD operations, data processing
- Key files: `auth.controller.js`, `clients.controller.js`, `payments.controller.js`

**server/src/routes/**
- Purpose: API route definitions
- Contains: Express Router configurations
- Key files: `index.js` (aggregator), `auth.routes.js`, `clients.routes.js`

**server/src/middleware/**
- Purpose: Express middleware functions
- Contains: Auth, error handling, validation
- Key files: `auth.middleware.js`, `errorHandler.middleware.js`

**server/src/utils/**
- Purpose: Backend utility functions
- Contains: JWT, password hashing
- Key files: `jwt.utils.js`, `password.utils.js`

**server/prisma/**
- Purpose: Database schema and migrations
- Contains: Prisma configuration, seed data
- Key files: `schema.prisma`, `seed.js`

## Key File Locations

**Entry Points:**
- `server/src/server.js` - Express server entry
- `client/src/main.jsx` - React app entry
- `client/src/App.jsx` - Router and app shell

**Configuration:**
- `package.json` - Root monorepo with workspaces
- `client/package.json` - Frontend dependencies
- `server/package.json` - Backend dependencies
- `client/vite.config.js` - Vite build config
- `client/tailwind.config.js` - Tailwind theme
- `server/prisma/schema.prisma` - Database schema

**Core Logic:**
- `server/src/controllers/` - All business logic
- `server/src/routes/` - API endpoint mapping
- `client/src/store/` - State management
- `client/src/utils/api.js` - API client

**Testing:**
- Not detected - No test files

**Documentation:**
- `README.md` - Project documentation

## Naming Conventions

**Files:**
- `kebab-case.jsx` - React components (legacy style used)
- `PascalCase.jsx` - Page components (`LoginPage.jsx`, `ClientsPage.jsx`)
- `camelCase.js` - Utilities (`authStore.js`, `helpers.js`)
- `{feature}.controller.js` - Controllers
- `{feature}.routes.js` - Routes
- `{feature}.middleware.js` - Middleware

**Directories:**
- Lowercase for all directories
- Plural for collections (`components/`, `pages/`, `routes/`)
- Feature-based for pages (`pages/admin/`, `pages/public/`)

**Special Patterns:**
- `*.utils.js` - Utility modules
- `*Store.js` - Zustand stores
- `index.js` - Route aggregation

## Where to Add New Code

**New Feature (Full Stack):**
- Backend controller: `server/src/controllers/{feature}.controller.js`
- Backend routes: `server/src/routes/{feature}.routes.js`
- Register routes: `server/src/routes/index.js`
- Frontend page: `client/src/pages/admin/{Feature}Page.jsx`
- Frontend store: `client/src/store/{feature}Store.js`
- API methods: `client/src/utils/api.js`

**New Component:**
- Implementation: `client/src/components/ui/{component}.jsx`
- Shared logic: `client/src/components/common/{Component}.jsx`

**New API Endpoint:**
- Route: `server/src/routes/{feature}.routes.js`
- Handler: `server/src/controllers/{feature}.controller.js`

**New Middleware:**
- Location: `server/src/middleware/{name}.middleware.js`
- Registration: `server/src/server.js`

**Utilities:**
- Frontend helpers: `client/src/utils/helpers.js`
- Backend helpers: `server/src/utils/{name}.utils.js`
- Validators: `client/src/utils/validators.js`

## Special Directories

**node_modules/**
- Purpose: npm dependencies (both client and server)
- Source: Generated by `npm install`
- Committed: No (in .gitignore)

**client/dist/**
- Purpose: Production build output
- Source: Generated by `npm run build`
- Committed: No

**server/prisma/migrations/**
- Purpose: Database migration history
- Source: Generated by `prisma migrate`
- Committed: Yes (tracks schema changes)

---

*Structure analysis: 2026-01-05*
*Update when directory structure changes*
