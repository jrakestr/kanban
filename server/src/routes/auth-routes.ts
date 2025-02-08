import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log('🔥 ============== LOGIN START ==============');
  console.log('🔥 REQUEST BODY:', req.body);
  console.log('🔥 CONTENT-TYPE:', req.headers['content-type']);
  console.log('==================== LOGIN START ====================');
  console.log('[DEBUG] Login attempt:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    // Find user by username
    console.log('🔥 FINDING USER:', username);
    const user = await User.findOne({ where: { username } });
    console.log('🔥 USER IN DB:', user ? {
      id: user.id,
      username: user.username,
      passwordHash: user.password,
    } : 'NO USER FOUND');
    if (!user) {
      res.status(401).json({ 
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Verify password
    console.log('🔥 COMPARING PASSWORDS:');
    console.log('🔥 PROVIDED PASSWORD:', password);
    console.log('🔥 STORED HASH:', user.password);
    const validPassword = await user.comparePassword(password);
    console.log('🔥 PASSWORD VALID:', validPassword);
    if (!validPassword) {
      res.status(401).json({ 
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Generate token
    console.log('[DEBUG] Generating JWT token...');
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '2h' }
    );

    // Send response
    const response: LoginResponse = {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
    res.json(response);
    return;
  } catch (error: unknown) {
    console.error('Login error:', error);
    // Send a more detailed error response
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? 
        error instanceof Error ? error.message : 'Unknown error' 
        : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
