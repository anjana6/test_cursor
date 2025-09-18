import { promisify } from 'util';
import database from '../database/connection';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority } from '../types';

const db = database.getDatabase();
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));
const run = promisify(db.run.bind(db));

export class TaskService {
  async createTask(userId: number, taskData: CreateTaskRequest): Promise<Task> {
    const { title, description, priority, dueDate } = taskData;

    // ISSUE: Missing type annotation for result
    const result = await run(
      'INSERT INTO tasks (title, description, priority, dueDate, userId) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, priority, dueDate || null, userId]
    );

    // ISSUE: Unsafe type assertion and missing null check
    const taskId = result.lastID;
    const newTask = await get('SELECT * FROM tasks WHERE id = ?', [taskId]);

    // ISSUE: Missing null check before type assertion
    return newTask as Task;
  }

  async getTasksByUserId(userId: number, filters?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    limit?: number;
    offset?: number;
  }): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE userId = ?';
    // ISSUE: Using 'any' type instead of proper typing
    const params: (string | number | null)[] = [userId];

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }

    query += ' ORDER BY createdAt DESC';

    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters?.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    // ISSUE: Missing type annotation and unsafe type assertion
    const tasks = await all(query, params);
    return tasks as Task[];
  }

  async getTaskById(id: number, userId: number): Promise<Task | null> {
    const task = await get('SELECT * FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
    return task as Task | null;
  }

  async updateTask(id: number, userId: number, updateData: UpdateTaskRequest): Promise<Task> {
    const fields = [];
    const values = [];

    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }

    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }

    if (updateData.status !== undefined) {
      fields.push('status = ?');
      values.push(updateData.status);
    }

    if (updateData.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updateData.priority);
    }

    if (updateData.dueDate !== undefined) {
      fields.push('dueDate = ?');
      values.push(updateData.dueDate);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id, userId);

    const result = await run(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );

    if ((result as any).changes === 0) {
      throw new Error('Task not found or access denied');
    }

    const updatedTask = await this.getTaskById(id, userId);
    if (!updatedTask) {
      throw new Error('Task not found');
    }

    return updatedTask;
  }

  async deleteTask(id: number, userId: number): Promise<void> {
    const result = await run('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
    if ((result as any).changes === 0) {
      throw new Error('Task not found or access denied');
    }
  }

  async getTaskStats(userId: number): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    cancelled: number;
  }> {
    const stats = await all(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks 
      WHERE userId = ? 
      GROUP BY status
    `, [userId]);

    const result = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      cancelled: 0
    };

    stats.forEach((stat: any) => {
      result.total += stat.count;
      result[stat.status as keyof typeof result] = stat.count;
    });

    return result;
  }

  async searchTasks(userId: number, searchTerm: string): Promise<Task[]> {
    const tasks = await all(
      'SELECT * FROM tasks WHERE userId = ? AND (title LIKE ? OR description LIKE ?) ORDER BY createdAt DESC',
      [userId, `%${searchTerm}%`, `%${searchTerm}%`]
    );

    return tasks as Task[];
  }
}
