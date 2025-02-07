import { User } from '../models/user.js';

export const seedUsers = async () => {
  try {
    console.log('Starting user seeding...');
    const users = await User.bulkCreate([
      { username: 'JollyGuru', password: 'password' },
      { username: 'SunnyScribe', password: 'password' },
      { username: 'RadiantComet', password: 'password' },
    ], { 
      individualHooks: true,
      returning: true
    });
    console.log(`Successfully created ${users.length} users`);
  } catch (error) {
    console.error('Error in seedUsers:', error);
    throw error;
  }
};
