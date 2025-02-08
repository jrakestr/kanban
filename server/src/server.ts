const forceDatabaseRefresh = true; // Enable database seeding

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
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

// Configure CORS for specific origins
const allowedOrigins = [
  'https://kanban-board-9ilp.onrender.com',
  'http://localhost:5173',
  'https://kanban-board-xm40.onrender.com'
];

// Handle CORS preflight requests
app.options('*', cors());

// Configure CORS with origin validation
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400 // Cache preflight request for 24 hours
}));

// Add error handling middleware
app.use((err: any, _req: any, res: any, next: any) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS Error',
      message: 'This origin is not allowed to access the resource'
    });
  } else {
    next(err);
  }
});
// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/health', healthRoutes); // Health check endpoint
app.use(routes); // Main application routes

// Global error handler
app.use((err: any, _req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '../../client/dist');

// Serve static files from the client's dist folder
app.use(express.static(clientPath));

// Handle client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Import seed functions
import { seedUsers } from './seeds/user-seeds.js';
import { seedTickets } from './seeds/ticket-seeds.js';

// Initialize database and seed data
// Initialize database
sequelize.sync({force: forceDatabaseRefresh}).then(async () => {
  console.log('Database connection established successfully.');
  if (forceDatabaseRefresh) {
    console.log('Database reset initiated...');
    try {
      await seedUsers();
      console.log('Users seeded successfully');
      await seedTickets();
      console.log('Tickets seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
