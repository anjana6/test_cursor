import { Router } from 'express';
import { register, login, getProfile, updateProfile, deleteProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateCreateUser, validateLogin } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateCreateUser, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/profile', authenticateToken, deleteProfile);

export default router;
