import { Request, Response } from 'express';
import { sequelize } from '../config/db.js';

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    res.status(200).json({ status: 'healthy', message: 'API is running and database is connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', message: 'Database connection failed' });
  }
};
