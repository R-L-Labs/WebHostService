import express from 'express';
import { getPackages, getPackage } from '../controllers/packages.controller.js';
import { validate, validateUUID } from '../middleware/validate.middleware.js';

const router = express.Router();

// All routes are public (for now)
router.get('/', getPackages);
router.get('/:id', validateUUID('id'), validate, getPackage);

export default router;
