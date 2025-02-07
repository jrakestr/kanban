import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { healthCheck } from '../controllers/health-controller.js';

const router = Router();

// Public routes (no authentication required)
router.get('/health', healthCheck);
router.use('/auth', authRoutes);

// Protected routes (authentication required)
router.use('/api', authenticateToken, apiRoutes);

export default router;
