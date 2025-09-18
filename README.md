# Task Management Application

A full-stack task management application built with React, Node.js, Express, and SQLite. This project is designed to test GitHub Copilot agent PR review functionality.

## 🚀 Features

### Backend (Node.js + Express + TypeScript)
- **RESTful API** with comprehensive CRUD operations
- **JWT Authentication** with secure password hashing
- **SQLite Database** with proper schema and relationships
- **Input Validation** using Joi schemas
- **Rate Limiting** and security middleware
- **Error Handling** with custom error types
- **TypeScript** for type safety
- **Jest Testing** with comprehensive test coverage

### Frontend (React + TypeScript)
- **Modern React** with hooks and functional components
- **Responsive Design** with Tailwind CSS
- **Task Management** with status tracking and priority levels
- **Real-time Updates** with optimistic UI
- **Authentication Flow** with protected routes
- **Dashboard** with statistics and progress tracking
- **Search and Filtering** capabilities
- **Toast Notifications** for user feedback

## 🏗️ Architecture

```
task-management-app/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── database/        # Database connection
│   │   ├── types/           # TypeScript interfaces
│   │   └── tests/           # Test files
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── contexts/        # React contexts
│   │   └── types/           # TypeScript interfaces
│   ├── public/
│   └── package.json
└── package.json             # Root package.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Jest** - Testing framework
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **date-fns** - Date utilities

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your configuration
   # The default values should work for development
   ```

4. **Start the development servers**
   ```bash
   # This will start both backend and frontend concurrently
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "priority": "high",
  "dueDate": "2024-01-15"
}
```

#### Get Tasks
```http
GET /api/tasks?status=todo&priority=high&search=project
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "urgent"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics
```http
GET /api/tasks/stats
Authorization: Bearer <token>
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Run All Tests
```bash
npm test
```

## 🏗️ Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Build Backend
```bash
cd backend
npm run build
```

### Start Production Server
```bash
cd backend
npm start
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
DB_PATH=./database.sqlite
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
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
);
```

## 🎯 Task Management Features

### Task Status
- **Todo** - New tasks that haven't been started
- **In Progress** - Tasks currently being worked on
- **Done** - Completed tasks
- **Cancelled** - Tasks that are no longer needed

### Task Priority
- **Low** - Not urgent, can be done later
- **Medium** - Normal priority
- **High** - Important, should be done soon
- **Urgent** - Critical, needs immediate attention

### Additional Features
- Due date tracking with overdue indicators
- Search functionality across title and description
- Filtering by status and priority
- Task statistics and progress tracking
- Responsive design for mobile and desktop
- Real-time updates and optimistic UI

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Using Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### Environment Setup
1. Set production environment variables
2. Build the frontend: `npm run build`
3. Build the backend: `npm run build`
4. Start the production server
5. Serve frontend static files through Express or a CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- SQLite database file is created in the backend directory
- Frontend proxy configuration for development
- CORS settings may need adjustment for production

## 🔮 Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] File attachments for tasks
- [ ] Team management and sharing
- [ ] Advanced reporting and analytics
- [ ] Mobile app with React Native
- [ ] Integration with external calendar apps
- [ ] Email notifications
- [ ] Dark mode theme
- [ ] Task templates and recurring tasks

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for testing GitHub Copilot agent PR review functionality. It includes comprehensive code that should provide good examples for AI code review analysis.