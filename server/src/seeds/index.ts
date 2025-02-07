import dotenv from 'dotenv';
dotenv.config();

console.log('Starting seeds/index.ts');

console.log('Importing seed functions...');
import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';

console.log('Importing sequelize...');
import { sequelize } from '../config/db.js';
console.log('All imports completed');

const seedAll = async (): Promise<void> => {
  try {
    console.log('Attempting to sync database...');
    await sequelize.sync({ force: true, alter: true });
    console.log('\n----- DATABASE SYNCED -----\n');
    
    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');
    
    await seedTickets();
    console.log('\n----- TICKETS SEEDED -----\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();
