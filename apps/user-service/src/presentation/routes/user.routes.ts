// apps/user-service/src/presentation/routes/user.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { createUserSchema, loginSchema, updateProfileSchema, validate } from '../../utils/validator';
import { userController } from '../controllers/user.controller';

const router = Router();

/**
 * PUBLIC ROUTES
 */

// Register new user
router.post(
  '/register',
  validate(createUserSchema),
  userController.register
);

// Login user
router.post(
  '/login',
  validate(loginSchema),
  userController.login
);

/**
 * PROTECTED ROUTES (require authentication)
 */

// Get current user profile
router.get(
  '/profile',
  authMiddleware,
  userController.getProfile
);

// Update user profile
router.put(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateProfile
);

// Delete user account
router.delete(
  '/delete',
  authMiddleware,
  userController.deleteUser
);

/**
 * ADDRESS ROUTES (protected)
 */

// Get all addresses
router.get(
  '/addresses',
  authMiddleware,
  userController.getAddresses
);

// Add new address
router.post(
  '/addresses',
  authMiddleware,
  userController.addAddress
);

// Update address by index
router.put(
  '/addresses/:index',
  authMiddleware,
  userController.updateAddress
);

// Delete address by index
router.delete(
  '/addresses/:index',
  authMiddleware,
  userController.deleteAddress
);

export default router;