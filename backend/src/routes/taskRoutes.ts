import { Router } from 'express';
import { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask, 
  getTaskStats 
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';
import { validateCreateTask, validateUpdateTask } from '../middleware/validation';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Task CRUD operations
router.post('/', validateCreateTask, createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTask);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
