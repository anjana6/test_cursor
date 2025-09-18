import { UserService } from '../services/userService';
import { CreateUserRequest, LoginRequest } from '../types';

// Mock database
jest.mock('../database/connection', () => ({
  getDatabase: () => ({
    get: jest.fn(),
    run: jest.fn(),
  }),
}));

describe('UserService', () => {
  let userService: UserService;
  let mockDb: any;

  beforeEach(() => {
    userService = new UserService();
    mockDb = require('../database/connection').default.getDatabase();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockDb.get.mockResolvedValueOnce(null); // No existing user
      mockDb.run.mockResolvedValueOnce({ lastID: 1 }); // User created
      mockDb.get.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });

      const result = await userService.createUser(userData);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });
    });

    it('should throw error if user already exists', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockDb.get.mockResolvedValueOnce({ id: 1 }); // User exists

      await expect(userService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HSy7K2a'; // bcrypt hash of 'password123'
      
      mockDb.get.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });

      const result = await userService.loginUser(loginData);

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      });
    });

    it('should throw error for invalid credentials', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockDb.get.mockResolvedValueOnce(null); // User not found

      await expect(userService.loginUser(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });
});
