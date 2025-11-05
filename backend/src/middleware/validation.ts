import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CreateUserRequest, LoginRequest, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority } from '../types';

const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 50 characters',
    'any.required': 'Name is required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).required().messages({
    'any.only': 'Priority must be one of: low, medium, high, urgent',
    'any.required': 'Priority is required'
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.format': 'Due date must be a valid ISO date string'
  })
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title must not exceed 200 characters'
  }),
  description: Joi.string().max(1000).optional().allow('').messages({
    'string.max': 'Description must not exceed 1000 characters'
  }),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional().messages({
    'any.only': 'Status must be one of: todo, in_progress, done, cancelled'
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional().messages({
    'any.only': 'Priority must be one of: low, medium, high, urgent'
  }),
  dueDate: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Due date must be a valid ISO date string'
  })
});

export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message
    });
    return;
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message
    });
    return;
  }
  next();
};

export const validateCreateTask = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = createTaskSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message
    });
    return;
  }
  next();
};

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = updateTaskSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message
    });
    return;
  }
  next();
};
