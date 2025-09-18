import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  User, 
  Task, 
  CreateUserRequest, 
  LoginRequest, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  TaskStats,
  TaskFilters
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          // ISSUE: Missing type assertion for headers
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/login', loginData);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<CreateUserRequest>): Promise<ApiResponse<User>> {
    const response = await this.api.put('/auth/profile', userData);
    return response.data;
  }

  async deleteProfile(): Promise<ApiResponse> {
    const response = await this.api.delete('/auth/profile');
    return response.data;
  }

  // Task endpoints
  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    const response = await this.api.post('/tasks', taskData);
    return response.data;
  }

  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    // ISSUE: Missing type checking for limit and offset
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    // ISSUE: Missing type annotation for response
    const response = await this.api.get(`/tasks?${params.toString()}`);
    return response.data;
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response = await this.api.get(`/tasks/${id}`);
    return response.data;
  }

  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    const response = await this.api.put(`/tasks/${id}`, taskData);
    return response.data;
  }

  async deleteTask(id: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/tasks/${id}`);
    return response.data;
  }

  async getTaskStats(): Promise<ApiResponse<TaskStats>> {
    const response = await this.api.get('/tasks/stats');
    return response.data;
  }
}

export default new ApiService();
