import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

console.log('Environment variables:', {
  DB_URL: process.env.DB_URL,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : undefined
});

export const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', {
      host: 'localhost',
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
      logging: console.log,
      define: {
        timestamps: true,
        underscored: false,
      }
    });
