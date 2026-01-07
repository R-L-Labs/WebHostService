import express from 'express';
import { body } from 'express-validator';
import { getUsers, getUser, resetPassword } from '../controllers/users.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate, validateUUID } from '../middleware/validate.middleware.js';
import { validatePasswordStrength } from '../utils/validation.utils.js';

const router = express.Router();

const resetPasswordValidation = [
  ...validateUUID('id'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .custom((value) => {
      const result = validatePasswordStrength(value);
      if (!result.isValid) {
        throw new Error(result.errors.join('. '));
      }
      return true;
    }),
];

// All routes are protected and restricted to SUPER_ADMIN
router.use(protect);
router.use(restrictTo('SUPER_ADMIN'));

router.get('/', getUsers);
router.get('/:id', validateUUID('id'), validate, getUser);
router.put('/:id/reset-password', resetPasswordValidation, validate, resetPassword);

export default router;
