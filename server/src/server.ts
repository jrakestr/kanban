import dotenv from 'dotenv';
dotenv.config();


import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors, { CorsOptions } from 'cors';

// Configuration
const forceDatabaseRefresh = true; // Enable database seeding

// Error interfaces
interface CorsError extends Error {
  status?: number;
}

interface AppError extends Error {
  status?: number;
  code?: string;
}
import routes from './routes/index.js';
import healthRoutes from './routes/health-routes.js';
import { sequelize } from './config/db.js';

// Log environment information
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? '[REDACTED]' : undefined,
  JWT_SECRET: process.env.JWT_SECRET ? '[PRESENT]' : '[MISSING]'
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// In production, allow all origins
const corsOptions: CorsOptions = {
  origin: true, // Allow all origins in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);

  // Capture response headers after CORS middleware
  res.on('finish', () => {
    console.log('=== Response Sent ===');
    console.log('Status:', res.statusCode);
    console.log('Response Headers:', res.getHeaders());
    console.log('======================\n');
  });
  next();
});

// Debug CORS handling
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    console.log('[CORS Preflight]', {
      origin: req.headers.origin,
      method: req.method,
      headers: req.headers
    });
  }
  next();
});

// Error handlers
const corsErrorHandler: ErrorRequestHandler = (err: CorsError, _req: Request, res: Response, next: NextFunction) => {
  console.log('[DEBUG] CORS Error:', {
    error: err.message,
    status: err.status,
    stack: err.stack
  });
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS Error',
      message: 'This origin is not allowed to access the resource'
    });
  } else {
    next(err);
  }
};

app.use(corsErrorHandler);
// Add request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/health', healthRoutes); // Health check endpoint
app.use(routes); // Main application routes

// Global error handler
const globalErrorHandler: ErrorRequestHandler = (err: AppError | CorsError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
};

app.use(globalErrorHandler);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '../../client/dist');

// Serve static files from the client's dist folder
app.use(express.static(clientPath));

// Handle client-side routing
app.get('*', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Import seed functions
import { seedUsers } from './seeds/user-seeds.js';
import { seedTickets } from './seeds/ticket-seeds.js';

// Initialize database and seed data
// Initialize database and start server
try {
  await sequelize.sync({force: forceDatabaseRefresh});
  console.log('Database connection established successfully.');
  
  if (forceDatabaseRefresh) {
    console.log('Database reset initiated...');
    try {
      await seedUsers();
      console.log('Users seeded successfully');
      await seedTickets();
      console.log('Tickets seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  // Handle server shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
} catch (error) {
  console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
