# External Integrations

**Analysis Date:** 2026-01-05

## APIs & External Services

**Payment Processing:**
- Not detected - No Stripe, PayPal, or payment gateway integration

**Email/SMS:**
- Not detected - No SendGrid, Twilio, or notification service

**External APIs:**
- Not detected - No third-party API integrations

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary data store
  - Connection: `DATABASE_URL` env var - `server/.env.example`
  - Client: Prisma ORM 6.19.1 - `server/package.json`
  - Migrations: `prisma migrate` in `server/prisma/migrations/`
  - Schema: `server/prisma/schema.prisma`

**File Storage:**
- Not detected - No AWS S3, Supabase Storage, or file upload service

**Caching:**
- Not detected - No Redis or caching layer

## Authentication & Identity

**Auth Provider:**
- Custom JWT authentication - Internal implementation
  - Implementation: `server/src/utils/jwt.utils.js`
  - Token storage: localStorage via Zustand persist - `client/src/store/authStore.js`
  - Session management: 24-hour JWT expiration
  - Password hashing: bcryptjs - `server/src/utils/password.utils.js`

**OAuth Integrations:**
- Not detected - No Google, GitHub, or social login

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry or error monitoring

**Analytics:**
- Not detected - No Google Analytics or Mixpanel

**Logs:**
- Console logging only - stdout/stderr
- No structured logging library

## CI/CD & Deployment

**Hosting:**
- Frontend: Vercel/Netlify compatible (Vite build)
- Backend: Render/Railway compatible (Node.js)
- Deployment: Manual (no CI/CD configuration detected)

**CI Pipeline:**
- Not detected - No GitHub Actions, CircleCI, etc.

## Environment Configuration

**Development:**
- Required env vars (client): `VITE_API_URL`
- Required env vars (server): `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CLIENT_URL`
- Secrets location: `.env` files (gitignored via `.env.example` pattern)
- Mock/stub services: Supabase development project

**Staging:**
- Not configured - Single environment setup

**Production:**
- Secrets management: Environment variables on hosting platform
- Database: Supabase production project

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints

**Outgoing:**
- Not detected - No outbound webhooks

## API Endpoints

**Base URL:** `http://localhost:5000/api` (dev) or `VITE_API_URL` (prod)

**Authentication:**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login` | - | Admin login |
| GET | `/auth/me` | ✓ | Get current user |
| POST | `/auth/refresh` | ✓ | Refresh JWT |

**Clients:**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/clients` | ✓ | List with pagination |
| GET | `/clients/stats` | ✓ | Statistics |
| GET | `/clients/:id` | ✓ | Single client |
| POST | `/clients` | ✓ | Create |
| PUT | `/clients/:id` | ✓ | Update |
| DELETE | `/clients/:id` | ✓ | Delete |

**Inquiries:**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/inquiries` | - | Public form submission |
| GET | `/inquiries` | ✓ | List inquiries |
| GET | `/inquiries/:id` | ✓ | Single inquiry |
| PUT | `/inquiries/:id` | ✓ | Update status |
| DELETE | `/inquiries/:id` | ✓ | Delete |

**Payments:**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/payments/client/:clientId` | ✓ | Client payments |
| GET | `/payments/:id` | ✓ | Single payment |
| POST | `/payments` | ✓ | Create |
| PUT | `/payments/:id` | ✓ | Update |
| DELETE | `/payments/:id` | ✓ | Delete |

**Users (Super Admin only):**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/users` | ✓ SUPER_ADMIN | List users |
| GET | `/users/:id` | ✓ SUPER_ADMIN | Single user |
| PUT | `/users/:id/reset-password` | ✓ SUPER_ADMIN | Reset password |

**Packages (Public):**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/packages` | - | List service packages |
| GET | `/packages/:id` | - | Single package |

**Health:**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/health` | - | Health check |

## Frontend API Client

- **Location:** `client/src/utils/api.js`
- **HTTP Client:** Axios with interceptors
- **Auto-includes:** JWT token in Authorization header
- **Auto-logout:** On 401 responses

---

*Integration audit: 2026-01-05*
*Update when adding/removing external services*
