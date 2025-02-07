import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the user type that matches our Express declaration
type AuthUser = {
  username: string;
  id: number;
};

// Define our JWT payload structure
interface JwtPayload extends AuthUser {
  iat?: number;
  exp?: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Middleware to authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    
    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      res.status(401).json({ message: 'Token has expired.' });
      return;
    }

    // Add user info to request (excluding JWT-specific fields)
    req.user = {
      id: decoded.id,
      username: decoded.username
    };
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
    return;
  }
};


