import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilters, TaskStats, CreateTaskRequest, UpdateTaskRequest } from '../types';
import apiService from '../services/api';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getTasks(filters);
      
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiService.getTaskStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch task stats:', err);
    }
  }, []);

  const createTask = async (taskData: CreateTaskRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.createTask(taskData);
      
      if (response.success && response.data) {
        // ISSUE: Using non-null assertion without proper checking
        setTasks(prev => [response.data!, ...prev]);
        await fetchStats(); // Refresh stats
      } else {
        throw new Error(response.error || 'Failed to create task');
      }
    } catch (err) {
      // ISSUE: Missing proper error type handling
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: number, taskData: UpdateTaskRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.updateTask(id, taskData);
      
      if (response.success && response.data) {
        setTasks(prev => 
          prev.map(task => 
            task.id === id ? response.data! : task
          )
        );
        await fetchStats(); // Refresh stats
      } else {
        throw new Error(response.error || 'Failed to update task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.deleteTask(id);
      
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== id));
        await fetchStats(); // Refresh stats
      } else {
        throw new Error(response.error || 'Failed to delete task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  return {
    tasks,
    stats,
    isLoading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
