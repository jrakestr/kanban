console.log('Starting models/index.ts');
import { sequelize } from '../config/db.js';
export { sequelize };

console.log('Importing User model...');
import { User } from './user.js';
console.log('User model imported');

console.log('Importing Ticket model...');
import { Ticket } from './ticket.js';
console.log('Ticket model imported');

console.log('Initializing model associations...');
try {
  console.log('Model associations initialized successfully');
} catch (error) {
  console.error('Error initializing model associations:', error);
  throw error;
}

export { User, Ticket };
