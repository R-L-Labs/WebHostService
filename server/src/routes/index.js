import express from 'express';
import authRoutes from './auth.routes.js';
import clientsRoutes from './clients.routes.js';
import inquiriesRoutes from './inquiries.routes.js';
import packagesRoutes from './packages.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/clients', clientsRoutes);
router.use('/inquiries', inquiriesRoutes);
router.use('/packages', packagesRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
