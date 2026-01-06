# Technology Stack

**Analysis Date:** 2026-01-05

## Languages

**Primary:**
- JavaScript/JSX - All application code (frontend and backend)

**Secondary:**
- SQL - Via Prisma ORM for database operations
- CSS - Tailwind CSS with PostCSS processing

## Runtime

**Environment:**
- Node.js 18+ - Backend runtime (specified in `package.json` engines)
- Modern browser environment - Frontend runs in browser with ES2020+ support

**Package Manager:**
- npm with workspaces (monorepo structure)
- Lockfiles: `package-lock.json`, `client/package-lock.json`

## Frameworks

**Core:**
- React 19.2.0 - Frontend UI library - `client/package.json`
- Express 5.2.1 - Backend web framework - `server/package.json`
- React Router DOM 7.11.0 - Client-side routing - `client/package.json`

**Testing:**
- Not detected - No test framework configured

**Build/Dev:**
- Vite 7.2.4 - Frontend bundler with React plugin - `client/vite.config.js`
- Tailwind CSS 3.4.19 - Utility-first CSS - `client/tailwind.config.js`
- PostCSS 8.5.6 - CSS processing - `client/postcss.config.js`
- ESLint 9.39.1 - Code linting - `client/eslint.config.js`
- Nodemon 3.1.11 - Dev server auto-restart - `server/package.json`
- Concurrently 8.2.2 - Run multiple dev servers - `package.json`

## Key Dependencies

**Critical:**
- Prisma 6.19.1 / @prisma/client 6.19.1 - Database ORM - `server/package.json`
- Zustand 5.0.9 - State management with persistence - `client/package.json`
- jsonwebtoken 9.0.3 - JWT authentication - `server/package.json`
- bcryptjs 3.0.3 - Password hashing - `server/package.json`

**Infrastructure:**
- Axios 1.13.2 - HTTP client with interceptors - `client/package.json`
- Helmet 8.1.0 - Security headers - `server/package.json`
- express-rate-limit 8.2.1 - API rate limiting - `server/package.json`
- cors 2.8.5 - Cross-origin resource sharing - `server/package.json`

**UI Components:**
- Lucide React 0.562.0 - Icon library - `client/package.json`
- Sonner 2.0.7 - Toast notifications - `client/package.json`
- clsx 2.1.1 + tailwind-merge 3.4.0 - Class utilities - `client/package.json`
- date-fns 2.30.0 - Date utilities - `client/package.json`

**Form & Validation:**
- React Hook Form 7.70.0 - Form state management - `client/package.json`
- Zod 4.3.5 - Schema validation - `client/package.json`
- @hookform/resolvers 5.2.2 - RHF + Zod integration - `client/package.json`
- express-validator 7.3.1 - Server input validation (installed but unused) - `server/package.json`

## Configuration

**Environment:**
- `.env` files for client and server
- Client: `VITE_API_URL` - `client/.env.example`
- Server: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CLIENT_URL`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS` - `server/.env.example`

**Build:**
- `client/vite.config.js` - Vite with React plugin and API proxy
- `client/tailwind.config.js` - Custom colors, animations, theme
- `client/postcss.config.js` - Tailwind + Autoprefixer
- `client/eslint.config.js` - ESLint 9 flat config with React plugins
- `server/prisma/schema.prisma` - Database schema

## Platform Requirements

**Development:**
- Any platform with Node.js 18+
- No Docker required (connects to Supabase cloud)

**Production:**
- Frontend: Vercel/Netlify (static build from `client/dist`)
- Backend: Render/Railway or similar Node.js platforms
- Database: PostgreSQL via Supabase

---

*Stack analysis: 2026-01-05*
*Update after major dependency changes*
