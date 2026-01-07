# Plan 1: Validation Infrastructure

**Phase:** 1 - API Validation
**Plan:** 1 of 3
**Goal:** Create reusable validation middleware and UUID parameter validator

## Context

The WebHostService API has 23 endpoints across 6 route files. None currently use express-validator despite the package being installed. This plan establishes the foundation that subsequent plans will use.

**Key files:**
- `server/src/middleware/` - Where validation middleware will live
- `server/src/routes/*.routes.js` - All route files to be updated
- `server/package.json` - express-validator already installed

## Tasks

### Task 1: Create validation middleware

Create a reusable middleware that processes express-validator results and returns consistent error responses.

**File:** `server/src/middleware/validate.middleware.js`

**Implementation:**
```javascript
import { validationResult } from 'express-validator';

/**
 * Middleware to handle express-validator results
 * Returns 400 with validation errors if any, otherwise continues
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};
```

**Verification:**
- File exists at correct path
- Exports `validate` function
- Error response matches existing API format (`success: false`, `message`, plus `errors` array)

### Task 2: Create UUID parameter validator

Create a reusable validator for UUID route parameters. All `:id` and `:clientId` params in the API are UUIDs.

**File:** `server/src/middleware/validate.middleware.js` (add to existing)

**Implementation:**
```javascript
import { param } from 'express-validator';

/**
 * Validates that a route parameter is a valid UUID
 * @param {string} paramName - Name of the route parameter (e.g., 'id', 'clientId')
 */
export const validateUUID = (paramName = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} must be a valid UUID`),
];
```

**Verification:**
- `validateUUID` exported
- Returns array of validators (for middleware chaining)
- Default parameter is 'id'
- Works with 'clientId' when passed explicitly

### Task 3: Create common query validators

Create reusable validators for pagination and filter query parameters used across multiple endpoints.

**File:** `server/src/middleware/validate.middleware.js` (add to existing)

**Implementation:**
```javascript
import { query } from 'express-validator';

/**
 * Validates common pagination query parameters
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100')
    .toInt(),
];

/**
 * Validates search query parameter
 */
export const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('search must be 100 characters or less'),
];
```

**Verification:**
- Both validators exported
- Pagination coerces to integers
- Reasonable defaults (page >= 1, limit 1-100)
- Search trimmed and length-limited

## Commit

```
feat(api): add validation middleware infrastructure

- Add validate middleware for express-validator result handling
- Add validateUUID for route parameter validation
- Add validatePagination and validateSearch for query params
- Consistent error response format matching existing API pattern
```

## Success Criteria

1. `validate.middleware.js` created with all exports
2. Error response format consistent with existing API
3. All validators return arrays for easy middleware chaining
4. No changes to existing route behavior (infrastructure only)
