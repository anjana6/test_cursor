import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      message: err.message
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    });
    return;
  }

  if (err.name === 'ForbiddenError') {
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Insufficient permissions'
    });
    return;
  }

  if (err.name === 'NotFoundError') {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: err.message
    });
    return;
  }

  // Handle SQLite errors
  if (err.message.includes('UNIQUE constraint failed')) {
    res.status(409).json({
      success: false,
      error: 'Conflict',
      message: 'Resource already exists'
    });
    return;
  }

  if (err.message.includes('FOREIGN KEY constraint failed')) {
    res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid reference to related resource'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
};
