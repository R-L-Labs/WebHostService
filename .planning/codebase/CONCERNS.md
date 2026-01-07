# Codebase Concerns

**Analysis Date:** 2026-01-05

## Tech Debt

**Missing Input Validation on API Endpoints:**
- Issue: Routes have no express-validator middleware despite package being installed
- Files: `server/src/routes/clients.routes.js`, `server/src/routes/payments.routes.js`, `server/src/routes/inquiries.routes.js`
- Why: Likely rapid development without validation layer
- Impact: Invalid data reaches controllers, no sanitization
- Fix approach: Implement express-validator middleware on all routes

**Floating Point Currency Calculations:**
- Issue: Using `parseFloat()` for currency amounts
- Files: `server/src/controllers/payments.controller.js` (lines 34, 88)
- Why: JavaScript default, Decimal type only in Prisma
- Impact: Potential precision loss in financial calculations
- Fix approach: Use decimal.js library or string-based math

**Console Logging in Production Code:**
- Issue: Development logging statements in production paths
- Files: `server/src/server.js` (lines 44, 74-76, 81), `server/src/middleware/errorHandler.middleware.js` (line 12)
- Why: Quick debugging during development
- Impact: Verbose logs, potential info leakage
- Fix approach: Use structured logging library (Pino/Winston)

**Unused Dependencies:**
- Issue: express-validator installed but never used
- File: `server/package.json`
- Why: Planned feature never implemented
- Impact: Bloated dependencies
- Fix approach: Remove or implement validation

## Known Bugs

**None documented** - No TODO/FIXME comments found in codebase

## Security Considerations

**Missing Route Parameter Validation:**
- Risk: Invalid UUIDs passed to database queries could cause errors or unexpected behavior
- Files: All controllers accessing `req.params.id`, `req.params.clientId`
- Current mitigation: Prisma throws on invalid IDs
- Recommendations: Add UUID validation middleware for parameterized routes

**Client-Side Role Authorization Missing:**
- Risk: Frontend ProtectedRoute only checks authentication, not roles
- File: `client/src/components/common/ProtectedRoute.jsx`
- Current mitigation: Backend enforces role checks via `restrictTo()` middleware
- Recommendations: Add role prop to ProtectedRoute for client-side gating

**Weak Password Requirements:**
- Risk: 6-character minimum allows weak passwords
- File: `server/src/controllers/users.controller.js` (line 52)
- Current mitigation: None
- Recommendations: Increase to 12+ characters, add complexity requirements

**JSON Parsing Without Error Handling:**
- Risk: `JSON.parse()` on corrupted data crashes endpoint
- File: `server/src/controllers/packages.controller.js` (lines 18-21, 52-56)
- Current mitigation: None
- Recommendations: Wrap in try/catch with fallback

## Performance Bottlenecks

**N+1 Query Pattern in Inquiries:**
- Problem: Multiple separate count queries instead of aggregation
- File: `server/src/controllers/inquiries.controller.js` (lines 78-81)
- Measurement: Not measured, but suboptimal query pattern
- Cause: Three separate `prisma.inquiry.count()` calls
- Improvement path: Use Prisma groupBy or raw aggregation query

**Missing Database Indexes:**
- Problem: No indexes on frequently queried fields
- File: `server/prisma/schema.prisma`
- Measurement: Not measured
- Cause: No performance optimization done
- Improvement path: Add indexes on `User.email`, `Client.email`, `Inquiry.email`, `Inquiry.status`

## Fragile Areas

**Authentication Middleware Chain:**
- File: `server/src/middleware/auth.middleware.js`
- Why fragile: JWT verification, user lookup, role check in sequence
- Common failures: Token expiration, user deleted but token valid
- Safe modification: Add comprehensive tests before changes
- Test coverage: None

**Axios Interceptor Logic:**
- File: `client/src/utils/api.js` (lines 20-40)
- Why fragile: Auto-logout on 401 could trigger during token refresh race
- Common failures: Logout loop if refresh fails
- Safe modification: Add token refresh logic before expiration
- Test coverage: None

## Scaling Limits

**Rate Limiting:**
- Current capacity: 100 requests per 15 minutes per IP
- Limit: Configured in `server/.env.example`
- Symptoms at limit: 429 Too Many Requests
- Scaling path: Adjust via environment variables

**No Caching Layer:**
- Current capacity: All requests hit database
- Limit: Supabase free tier limits
- Symptoms at limit: Slow responses, connection limits
- Scaling path: Add Redis caching for frequent queries

## Dependencies at Risk

**None identified** - Dependencies are recent and actively maintained

## Missing Critical Features

**No Test Suite:**
- Problem: Zero automated tests
- Current workaround: Manual testing only
- Blocks: Safe refactoring, CI/CD pipeline
- Implementation complexity: Medium (setup framework, write initial tests)

**No Email Notifications:**
- Problem: Contact form submissions don't trigger emails
- Current workaround: Admins must check dashboard manually
- Blocks: Timely inquiry response
- Implementation complexity: Low (add Nodemailer/SendGrid)

**No Audit Trail:**
- Problem: Hard deletes with no history
- Current workaround: None
- Blocks: Compliance, debugging, recovery
- Implementation complexity: Medium (add soft delete, audit table)

## Test Coverage Gaps

**All Code Untested:**
- What's not tested: Everything
- Risk: Any change could break production
- Priority: High
- Difficulty to test: Medium - need to set up framework first

**Critical Paths Without Tests:**
- `server/src/utils/jwt.utils.js` - Token generation/verification
- `server/src/utils/password.utils.js` - Password hashing
- `server/src/controllers/auth.controller.js` - Login logic
- `server/src/controllers/payments.controller.js` - Financial calculations

---

## Summary by Severity

**High Priority:**
1. Missing input validation on API endpoints
2. No test coverage
3. Weak password requirements
4. Missing route parameter validation

**Medium Priority:**
5. N+1 query patterns
6. Missing database indexes
7. Console logging in production
8. JSON parsing without error handling

**Low Priority:**
9. Unused dependencies
10. No audit trail
11. No email notifications

---

*Concerns audit: 2026-01-05*
*Update as issues are fixed or new ones discovered*
