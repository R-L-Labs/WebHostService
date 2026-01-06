import express from 'express';
import { login, getMe, refresh } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/refresh', protect, refresh);

export default router;
