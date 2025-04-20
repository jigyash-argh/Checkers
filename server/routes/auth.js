import express from 'express';
import { register, login, getMe, logout, updatePassword } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatepassword', protect, updatePassword);

export default router;