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
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      res.status(401).json({
        error: 'Authentication Error',
        message: 'No authorization header provided',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        error: 'Authentication Error',
        message: 'No token provided in authorization header',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set in environment variables');
      res.status(500).json({
        error: 'Server Configuration Error',
        message: 'Authentication is not properly configured',
        timestamp: new Date().toISOString()
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      // Check token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        res.status(401).json({
          error: 'Authentication Error',
          message: 'Token has expired',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Add user info to request (excluding JWT-specific fields)
      req.user = {
        id: decoded.id,
        username: decoded.username
      };
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(403).json({
        error: 'Authentication Error',
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString()
      });
      return;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication Error',
      message: 'An error occurred during authentication',
      timestamp: new Date().toISOString()
    });
  }
};


