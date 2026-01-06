import express from 'express';
import { getUsers, getUser, resetPassword } from '../controllers/users.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected and restricted to SUPER_ADMIN
router.use(protect);
router.use(restrictTo('SUPER_ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id/reset-password', resetPassword);

export default router;
