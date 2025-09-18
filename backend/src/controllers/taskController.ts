import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, UpdateTaskRequest, ApiResponse, TaskStatus, TaskPriority } from '../types';

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskData: CreateTaskRequest = req.body;

    const task = await taskService.createTask(userId, taskData);

    const response: ApiResponse = {
      success: true,
      data: task,
      message: 'Task created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create task'
    };

    res.status(500).json(response);
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { status, priority, limit, offset, search } = req.query;

    let tasks;

    if (search) {
      tasks = await taskService.searchTasks(userId, search as string);
    } else {
      const filters: any = {};
      if (status) filters.status = status as TaskStatus;
      if (priority) filters.priority = priority as TaskPriority;
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);

      tasks = await taskService.getTasksByUserId(userId, filters);
    }

    const response: ApiResponse = {
      success: true,
      data: tasks
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get tasks'
    };

    res.status(500).json(response);
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid task ID'
      };
      res.status(400).json(response);
      return;
    }

    const task = await taskService.getTaskById(taskId, userId);

    if (!task) {
      const response: ApiResponse = {
        success: false,
        error: 'Task not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: task
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get task'
    };

    res.status(500).json(response);
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskId = parseInt(req.params.id);
    const updateData: UpdateTaskRequest = req.body;

    if (isNaN(taskId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid task ID'
      };
      res.status(400).json(response);
      return;
    }

    const task = await taskService.updateTask(taskId, userId, updateData);

    const response: ApiResponse = {
      success: true,
      data: task,
      message: 'Task updated successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update task'
    };

    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json(response);
    } else {
      res.status(500).json(response);
    }
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid task ID'
      };
      res.status(400).json(response);
      return;
    }

    await taskService.deleteTask(taskId, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Task deleted successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete task'
    };

    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json(response);
    } else {
      res.status(500).json(response);
    }
  }
};

export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const stats = await taskService.getTaskStats(userId);

    const response: ApiResponse = {
      success: true,
      data: stats
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get task statistics'
    };

    res.status(500).json(response);
  }
};
