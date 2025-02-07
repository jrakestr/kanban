const forceDatabaseRefresh = false;

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(routes);

// Serve static files from the client's dist folder
app.use(express.static('../client/dist'));

// Handle client-side routing
app.get('*', (_req, res) => {
  res.sendFile('index.html', { root: '../client/dist' });
});

sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
