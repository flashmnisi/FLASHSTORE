// apps/user-service/src/presentation/routes/auth.routes.ts

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { loginSchema } from '../../application/dtos/create-user.dto';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../utils/validator';

const router = Router();

/**
 * PUBLIC AUTH ROUTES
 */

// Login
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// Refresh Token (optional - if you implement later)
router.post('/refresh-token', authController.refreshToken);

/**
 * PROTECTED AUTH ROUTES
 */

// Logout (invalidate refresh token)
router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

// Get current user info (lightweight)
router.get(
  '/me',
  authMiddleware,
  authController.getCurrentUser
);

export default router;