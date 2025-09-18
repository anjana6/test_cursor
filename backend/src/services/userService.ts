import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import database from '../database/connection';
import { User, CreateUserRequest, LoginRequest, AuthResponse } from '../types';

const db = database.getDatabase();
const get = promisify(db.get.bind(db));
const run = promisify(db.run.bind(db));

export class UserService {
  async createUser(userData: CreateUserRequest): Promise<Omit<User, 'password'>> {
    const { email, password, name } = userData;

    // Check if user already exists
    const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password - ISSUE: Missing type annotation for saltRounds
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    // ISSUE: Unsafe type assertion without proper type checking
    const userId = result.lastID;
    const newUser = await get('SELECT id, email, name, createdAt, updatedAt FROM users WHERE id = ?', [userId]);

    // ISSUE: Missing null check before type assertion
    return newUser as Omit<User, 'password'>;
  }

  async loginUser(loginData: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user by email - ISSUE: Unsafe type assertion
    const user = await get('SELECT * FROM users WHERE email = ?', [email]) as User;
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    // ISSUE: Incorrect JWT payload type - should be more specific
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await get('SELECT id, email, name, createdAt, updatedAt FROM users WHERE id = ?', [id]);
    return user as Omit<User, 'password'> | null;
  }

  async updateUser(id: number, updateData: Partial<CreateUserRequest>): Promise<Omit<User, 'password'>> {
    const fields = [];
    const values = [];

    if (updateData.name) {
      fields.push('name = ?');
      values.push(updateData.name);
    }

    if (updateData.email) {
      fields.push('email = ?');
      values.push(updateData.email);
    }

    if (updateData.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    await run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const updatedUser = await this.getUserById(id);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const result = await run('DELETE FROM users WHERE id = ?', [id]);
    if ((result as any).changes === 0) {
      throw new Error('User not found');
    }
  }
}
