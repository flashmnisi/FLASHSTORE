import { Router } from 'express';

import {
  RegisterUser,
  loginUser,
  getUserProfile,
  updateProfile,
  deleteUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// ====================== PUBLIC ROUTES ======================
router.post('/register', RegisterUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

// ====================== PROTECTED ROUTES ======================
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.delete('/delete', protect, deleteUser);

// Address Management
router.post('/address', protect, addAddress);
router.get('/addresses', protect, getAddresses);
router.put('/address/:index', protect, updateAddress);
router.delete('/address/:index', protect, deleteAddress);

export default router;