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

// Custom error for authentication failures
class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

// Middleware to authenticate JWT token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      throw new AuthError('No authorization header provided');
    }

    const [scheme, token] = authHeader.split(' ');
    
    if (scheme !== 'Bearer') {
      throw new AuthError('Invalid authorization scheme. Use Bearer');
    }

    if (!token) {
      throw new AuthError('No token provided in authorization header');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not configured');
      throw new AuthError('Server configuration error', 500);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Check token expiration explicitly even though jwt.verify does this
    // This gives us a chance to provide a more specific error message
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new AuthError('Token has expired');
    }

    if (!decoded.username || !decoded.id) {
      throw new AuthError('Invalid token payload');
    }

    req.user = {
      username: decoded.username,
      id: decoded.id
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof AuthError) {
      res.status(error.status).json({
        error: 'Authentication Error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Authentication Error',
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Authentication Error',
        message: 'Token has expired',
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.status(500).json({
      error: 'Server Error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    });
  }
};


