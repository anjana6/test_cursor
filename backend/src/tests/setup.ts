// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DB_PATH = ':memory:';
process.env.BCRYPT_ROUNDS = '4'; // Lower rounds for faster tests
