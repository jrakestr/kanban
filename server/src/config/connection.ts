import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : undefined
});

const dbName = process.env.DB_NAME || 'kanban_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '';

// First, create a connection to PostgreSQL without a specific database
const rootSequelize = new Sequelize('postgres', dbUser, dbPassword, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

// Create the database if it doesn't exist
async function initializeDatabase() {
  try {
    // Try to create the database
    await rootSequelize.query(`CREATE DATABASE ${dbName};`);
    console.log(`Database ${dbName} created.`);
  } catch (error: any) {
    if (error.parent?.code !== '42P04') { // 42P04 is the error code for "database already exists"
      console.error('Error creating database:', error);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  }

  // Close the root connection
  await rootSequelize.close();
}

// Now create the actual connection to our database
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log,
  dialectOptions: {
    decimalNumbers: true,
  },
  define: {
    schema: 'public',
    timestamps: true,
    underscored: false,
  },
});

// Initialize the database and test the connection
initializeDatabase()
  .then(() => sequelize.authenticate())
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
