// server/src/routes/authRoutes.ts
import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);        // POST /api/auth/login
router.get('/me', protect, getCurrentUser);

export default router;

