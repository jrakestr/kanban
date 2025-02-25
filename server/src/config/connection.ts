import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Only load .env file if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Debug: print the raw DATABASE_URL
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Trim the DATABASE_URL to remove extraneous characters
const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : undefined;

// Exit with error if in production and DATABASE_URL is missing
if (process.env.NODE_ENV === 'production' && !dbUrl) {
  console.error("FATAL: DATABASE_URL is missing in production.");
  process.exit(1);
}

console.log('Environment variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : undefined
});

export let sequelize: Sequelize;

if (dbUrl) {
  console.log('Using DATABASE_URL for production connection.');
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      decimalNumbers: true,
      keepAlive: true
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      schema: 'public',
      timestamps: true,
      underscored: false,
    },
  });

  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully using DATABASE_URL.');
      // Start heartbeat: ping the database every 60 seconds to keep connection alive and log status
      setInterval(async () => {
        try {
          await sequelize.query('SELECT 1');
          console.log('Heartbeat successful');
        } catch (heartbeatError: any) {
          console.error('Heartbeat failed:', heartbeatError);
        }
      }, 60000);
    } catch (error: any) {
      console.error('Unable to connect to the database using DATABASE_URL. Detailed error info:');
      console.error(error);
      console.error('Error stack:', error.stack);
    }
  })();
} else {
  const dbName = process.env.DB_NAME || 'kanban_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '';

  console.log('DATABASE_URL not set. Using local configuration.');
  console.log(`Local DB config - DB_NAME: ${dbName}, DB_USER: ${dbUser}`);

  const rootSequelize = new Sequelize('postgres', dbUser, dbPassword, {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
  });

  (async () => {
    try {
      await rootSequelize.query(`CREATE DATABASE ${dbName};`);
      console.log(`Database ${dbName} created.`);
    } catch (error: any) {
      if (error.parent?.code !== '42P04') {
        console.error('Error creating database:', error);
      } else {
        console.log(`Database ${dbName} already exists.`);
      }
    }
    await rootSequelize.close();
  })();

  console.log('Attempting to connect using local configuration...');
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
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

  sequelize.authenticate()
    .then(() => {
      console.log('Database connection established successfully using local config.');
    })
    .catch(err => {
      console.error('Unable to connect to the database using local config:', err);
    });
}

export default sequelize;
