import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types';

interface AuthRequest extends Request {
  user?: Omit<User, 'password'>;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Access token required' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ success: false, error: 'JWT secret not configured' });
    return;
  }

  // ISSUE: Missing type annotation for callback parameters
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    // ISSUE: Unsafe type assertion without proper validation
    req.user = decoded as Omit<User, 'password'>;
    next();
  });
};

export { AuthRequest };
