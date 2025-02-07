import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '2h' }
    );

    // Send response
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
    return;
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
