import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserRequest, LoginRequest, ApiResponse } from '../types';

const userService = new UserService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // ISSUE: Missing type validation for req.body
    const userData: CreateUserRequest = req.body;
    const user = await userService.createUser(userData);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User registered successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    // ISSUE: Using 'any' type instead of proper error typing
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };

    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json(response);
    } else {
      res.status(500).json(response);
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginRequest = req.body;
    const authResponse = await userService.loginUser(loginData);

    const response: ApiResponse = {
      success: true,
      data: authResponse,
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };

    res.status(401).json(response);
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: user
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get profile'
    };

    res.status(500).json(response);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const updateData = req.body;

    const user = await userService.updateUser(userId, updateData);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'Profile updated successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile'
    };

    res.status(500).json(response);
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await userService.deleteUser(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Profile deleted successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete profile'
    };

    res.status(500).json(response);
  }
};
