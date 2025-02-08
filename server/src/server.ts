const forceDatabaseRefresh = true; // Enable database seeding

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

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
app.use(express.json());
app.use(routes);

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
sequelize.sync({force: forceDatabaseRefresh}).then(async () => {
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
