import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : undefined
});

const databaseUrl = process.env.DATABASE_URL;

export let sequelize: Sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
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
      console.log('Database connection established successfully using DATABASE_URL.');
    })
    .catch(err => {
      console.error('Unable to connect to the database using DATABASE_URL:', err);
    });
} else {
  const dbName = process.env.DB_NAME || 'kanban_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '';

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
