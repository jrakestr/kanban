import { Router, Request, Response } from 'express';
import { sequelize } from '../config/db.js';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database connection error:', errorMessage);
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
