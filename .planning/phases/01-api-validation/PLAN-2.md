# Plan 2: Auth, Clients, and Inquiries Validation

**Phase:** 1 - API Validation
**Plan:** 2 of 3
**Goal:** Add input validation to auth, clients, and inquiries route files

## Context

This plan adds validators to the three most critical route files:
- Auth routes: Login is public-facing and security-critical
- Clients routes: Core business entity with full CRUD
- Inquiries routes: Public submission endpoint (attack surface)

**Dependencies:** Plan 1 (validation infrastructure)

**Key files:**
- `server/src/routes/auth.routes.js` - 3 endpoints
- `server/src/routes/clients.routes.js` - 6 endpoints
- `server/src/routes/inquiries.routes.js` - 5 endpoints

## Tasks

### Task 1: Add auth route validators

Add validation to auth endpoints. Login is public and needs strict validation.

**File:** `server/src/routes/auth.routes.js`

**Validators needed:**
- `POST /login`: email (required, email format), password (required, min 1 char)

**Implementation:**
```javascript
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Update route
router.post('/login', loginValidation, validate, login);
```

**Verification:**
- Login rejects missing email/password with 400
- Login rejects invalid email format with 400
- Email is normalized (lowercase, trimmed)
- Valid credentials still work

### Task 2: Add clients route validators

Add validation to all clients endpoints. UUID params and body fields need validation.

**File:** `server/src/routes/clients.routes.js`

**Validators needed:**
- `GET /`: pagination (page, limit), search, status (optional, enum)
- `GET /:id`: UUID param
- `POST /`: businessName, contactName, email (required); phone, website, status, packageId, notes (optional)
- `PUT /:id`: UUID param + optional body fields
- `DELETE /:id`: UUID param

**Implementation:**
```javascript
import { body, query } from 'express-validator';
import { validate, validateUUID, validatePagination, validateSearch } from '../middleware/validate.middleware.js';

const clientStatusValues = ['PROSPECT', 'ACTIVE', 'INACTIVE', 'CANCELLED'];

const getClientsValidation = [
  ...validatePagination,
  ...validateSearch,
  query('status')
    .optional()
    .isIn(['ALL', ...clientStatusValues])
    .withMessage(`status must be one of: ALL, ${clientStatusValues.join(', ')}`),
];

const createClientValidation = [
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ max: 255 })
    .withMessage('Business name must be 255 characters or less'),
  body('contactName')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required')
    .isLength({ max: 255 })
    .withMessage('Contact name must be 255 characters or less'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be 50 characters or less'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  body('status')
    .optional()
    .isIn(clientStatusValues)
    .withMessage(`status must be one of: ${clientStatusValues.join(', ')}`),
  body('packageId')
    .optional()
    .isUUID()
    .withMessage('packageId must be a valid UUID'),
  body('notes')
    .optional()
    .trim(),
];

const updateClientValidation = [
  ...validateUUID('id'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Business name must be 1-255 characters'),
  body('contactName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Contact name must be 1-255 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be 50 characters or less'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  body('status')
    .optional()
    .isIn(clientStatusValues)
    .withMessage(`status must be one of: ${clientStatusValues.join(', ')}`),
  body('packageId')
    .optional({ nullable: true })
    .isUUID()
    .withMessage('packageId must be a valid UUID'),
];

// Update routes
router.get('/', getClientsValidation, validate, getClients);
router.get('/:id', validateUUID('id'), validate, getClient);
router.post('/', createClientValidation, validate, createClient);
router.put('/:id', updateClientValidation, validate, updateClient);
router.delete('/:id', validateUUID('id'), validate, deleteClient);
```

**Verification:**
- GET / with invalid page/limit returns 400
- GET /:id with invalid UUID returns 400
- POST / with missing required fields returns 400
- PUT /:id with invalid UUID or bad email returns 400
- DELETE /:id with invalid UUID returns 400
- Valid requests still work

### Task 3: Add inquiries route validators

Add validation to all inquiries endpoints. Public submission needs careful validation.

**File:** `server/src/routes/inquiries.routes.js`

**Validators needed:**
- `POST /` (public): name, email, message (required); phone, businessName, interestedPackage (optional)
- `GET /`: pagination, status (optional, enum)
- `GET /:id`: UUID param
- `PUT /:id`: UUID param + status (required, enum)
- `DELETE /:id`: UUID param

**Implementation:**
```javascript
import { body, query } from 'express-validator';
import { validate, validateUUID, validatePagination } from '../middleware/validate.middleware.js';

const inquiryStatusValues = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DISMISSED'];

const submitInquiryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name must be 255 characters or less'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 5000 })
    .withMessage('Message must be 5000 characters or less'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be 50 characters or less'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Business name must be 255 characters or less'),
  body('interestedPackage')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Interested package must be 255 characters or less'),
];

const getInquiriesValidation = [
  ...validatePagination,
  query('status')
    .optional()
    .isIn(['ALL', ...inquiryStatusValues])
    .withMessage(`status must be one of: ALL, ${inquiryStatusValues.join(', ')}`),
];

const updateInquiryValidation = [
  ...validateUUID('id'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(inquiryStatusValues)
    .withMessage(`status must be one of: ${inquiryStatusValues.join(', ')}`),
];

// Update routes
router.post('/', submitInquiryValidation, validate, submitInquiry);
router.get('/', protect, getInquiriesValidation, validate, getInquiries);
router.get('/:id', protect, validateUUID('id'), validate, getInquiry);
router.put('/:id', protect, updateInquiryValidation, validate, updateInquiry);
router.delete('/:id', protect, validateUUID('id'), validate, deleteInquiry);
```

**Verification:**
- Public POST / rejects missing name/email/message with 400
- Public POST / rejects invalid email format with 400
- GET / with invalid pagination returns 400
- PUT /:id rejects invalid status enum with 400
- Valid requests still work

## Commit

```
feat(api): add validation to auth, clients, and inquiries routes

- Add login validation (email format, required fields)
- Add clients CRUD validation (UUID params, body fields, enums)
- Add inquiries validation (public submission, status workflow)
- All endpoints return consistent 400 error format
```

## Success Criteria

1. All 14 endpoints have appropriate validation
2. Invalid requests return 400 with descriptive error messages
3. Valid requests continue to work unchanged
4. Email fields are normalized (lowercase, trimmed)
5. Enum fields only accept valid values
