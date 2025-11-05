import sqlite3 from 'sqlite3';
import path from 'path';
import { promisify } from 'util';

const DB_PATH = process.env.DB_PATH || './database.sqlite';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.init();
  }

  private async init(): Promise<void> {
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));

    // Users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks table
    await run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        dueDate DATETIME,
        userId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await run(`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(userId)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)`);
  }

  getDatabase(): sqlite3.Database {
    return this.db;
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default new Database();
