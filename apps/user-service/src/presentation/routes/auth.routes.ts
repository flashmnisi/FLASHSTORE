// apps/user-service/src/presentation/routes/auth.routes.ts

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../../utils/validator';
import { loginSchema, createUserSchema } from '../../application/dtos/create-user.dto';

const router = Router();

/** ====================== PUBLIC AUTH ROUTES ====================== */

// Register
router.post(
  '/register',
  validate(createUserSchema),
  authController.register
);

// Login
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// Refresh token (optional)
router.post('/refresh-token', authController.refreshToken);

export default router;