// apps/user-service/src/presentation/routes/user.routes.ts

import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { extractUser } from '../../middlewares/auth.middleware';
import { validate } from '../../utils/validator';
import { updateProfileSchema } from '../../application/dtos/create-user.dto';

const router = Router();

/** ====================== PROTECTED USER ROUTES ====================== */

// Profile
router.get('/profile', extractUser, userController.getProfile);

router.put(
  '/profile',
  extractUser,
  validate(updateProfileSchema),
  userController.updateProfile
);

// Delete account
router.delete('/delete', extractUser, userController.deleteUser);

// Addresses
router.get('/addresses', extractUser, userController.getAddresses);
router.post('/addresses', extractUser, userController.addAddress);
router.put('/addresses/:index', extractUser, userController.updateAddress);
router.delete('/addresses/:index', extractUser, userController.deleteAddress);

export default router;