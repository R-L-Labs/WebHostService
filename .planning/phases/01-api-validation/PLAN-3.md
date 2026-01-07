# Plan 3: Packages, Payments, and Users Validation

**Phase:** 1 - API Validation
**Plan:** 3 of 3
**Goal:** Add input validation to packages, payments, and users route files

## Context

This plan completes Phase 1 by adding validators to the remaining three route files:
- Packages routes: Public, read-only (minimal validation needed)
- Payments routes: Financial data requiring careful validation
- Users routes: Admin-only, security-sensitive

**Dependencies:** Plan 1 (validation infrastructure)

**Key files:**
- `server/src/routes/packages.routes.js` - 2 endpoints (read-only)
- `server/src/routes/payments.routes.js` - 5 endpoints
- `server/src/routes/users.routes.js` - 3 endpoints

## Tasks

### Task 1: Add packages route validators

Add validation to packages endpoints. Both are read-only public endpoints.

**File:** `server/src/routes/packages.routes.js`

**Validators needed:**
- `GET /`: None (no params)
- `GET /:id`: UUID param

**Implementation:**
```javascript
import { validate, validateUUID } from '../middleware/validate.middleware.js';

// Update routes
router.get('/', getPackages);  // No validation needed
router.get('/:id', validateUUID('id'), validate, getPackage);
```

**Verification:**
- GET /:id with invalid UUID returns 400
- Valid requests still work

### Task 2: Add payments route validators

Add validation to all payments endpoints. Financial data needs strict validation.

**File:** `server/src/routes/payments.routes.js`

**Validators needed:**
- `GET /client/:clientId`: UUID param
- `GET /:id`: UUID param
- `POST /`: clientId, amount, paymentDate (required); description, paymentMethod, status, notes (optional)
- `PUT /:id`: UUID param + optional body fields
- `DELETE /:id`: UUID param

**Implementation:**
```javascript
import { body } from 'express-validator';
import { validate, validateUUID } from '../middleware/validate.middleware.js';

const paymentMethodValues = ['CASH', 'CHECK', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'VENMO', 'ZELLE', 'OTHER'];
const paymentStatusValues = ['PENDING', 'PAID', 'REFUNDED', 'FAILED'];

const createPaymentValidation = [
  body('clientId')
    .notEmpty()
    .withMessage('Client ID is required')
    .isUUID()
    .withMessage('clientId must be a valid UUID'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Amount must be a valid decimal with up to 2 decimal places')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  body('paymentDate')
    .notEmpty()
    .withMessage('Payment date is required')
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must be 255 characters or less'),
  body('paymentMethod')
    .optional()
    .isIn(paymentMethodValues)
    .withMessage(`paymentMethod must be one of: ${paymentMethodValues.join(', ')}`),
  body('status')
    .optional()
    .isIn(paymentStatusValues)
    .withMessage(`status must be one of: ${paymentStatusValues.join(', ')}`),
  body('notes')
    .optional()
    .trim(),
];

const updatePaymentValidation = [
  ...validateUUID('id'),
  body('amount')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Amount must be a valid decimal with up to 2 decimal places')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  body('paymentDate')
    .optional()
    .isISO8601()
    .withMessage('Payment date must be a valid date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must be 255 characters or less'),
  body('paymentMethod')
    .optional()
    .isIn(paymentMethodValues)
    .withMessage(`paymentMethod must be one of: ${paymentMethodValues.join(', ')}`),
  body('status')
    .optional()
    .isIn(paymentStatusValues)
    .withMessage(`status must be one of: ${paymentStatusValues.join(', ')}`),
  body('notes')
    .optional()
    .trim(),
];

// Update routes
router.get('/client/:clientId', validateUUID('clientId'), validate, getClientPayments);
router.get('/:id', validateUUID('id'), validate, getPayment);
router.post('/', createPaymentValidation, validate, createPayment);
router.put('/:id', updatePaymentValidation, validate, updatePayment);
router.delete('/:id', validateUUID('id'), validate, deletePayment);
```

**Verification:**
- GET /client/:clientId with invalid UUID returns 400
- POST / with missing required fields returns 400
- POST / with invalid amount (negative, too many decimals) returns 400
- POST / with invalid paymentMethod enum returns 400
- PUT /:id with invalid data returns 400
- Valid requests still work

### Task 3: Add users route validators

Add validation to all users endpoints. Security-sensitive, SUPER_ADMIN only.

**File:** `server/src/routes/users.routes.js`

**Validators needed:**
- `GET /`: None (no params)
- `GET /:id`: UUID param
- `PUT /:id/reset-password`: UUID param + newPassword (required, min 6 chars per existing logic)

**Implementation:**
```javascript
import { body } from 'express-validator';
import { validate, validateUUID } from '../middleware/validate.middleware.js';

const resetPasswordValidation = [
  ...validateUUID('id'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Update routes
router.get('/', getUsers);  // No validation needed
router.get('/:id', validateUUID('id'), validate, getUser);
router.put('/:id/reset-password', resetPasswordValidation, validate, resetPassword);
```

**Note:** Password length is kept at 6 chars to match existing controller logic. Phase 3 (Security Hardening) will increase this to 12+ chars.

**Verification:**
- GET /:id with invalid UUID returns 400
- PUT /:id/reset-password with invalid UUID returns 400
- PUT /:id/reset-password with missing/short password returns 400
- Valid requests still work

## Commit

```
feat(api): add validation to packages, payments, and users routes

- Add packages UUID validation (read-only endpoints)
- Add payments validation (amount, dates, enums)
- Add users validation (UUID params, password reset)
- Complete Phase 1: all 23 API endpoints now validated
```

## Success Criteria

1. All 10 remaining endpoints have appropriate validation
2. Payment amounts validated as positive decimals
3. Payment dates validated as ISO8601
4. All enum fields only accept valid values
5. All UUID params reject invalid formats
6. Valid requests continue to work unchanged

## Phase Completion

After this plan:
- All 23 API endpoints have input validation
- All UUID route parameters are validated
- All body fields have type and format validation
- All enum fields are restricted to valid values
- Error responses are consistent across all endpoints

Update STATE.md and ROADMAP.md to mark Phase 1 complete.
