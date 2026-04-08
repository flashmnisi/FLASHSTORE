import { Router } from 'express';

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  deleteUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// ====================== PUBLIC ROUTES ======================
router.post('/register', registerUser);
router.post('/login', loginUser);           // ← This was missing or not mounted

// Password reset (placeholders)
// router.post('/forgot-password', forgotPassword);
// router.post('/verify-otp', verifyResetOtp);
// router.post('/reset-password', resetPassword);

// ====================== PROTECTED ROUTES ======================
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.delete('/delete', protect, deleteUser);

// Address Management
router.get('/addresses', protect, getAddresses);
router.post('/address', protect, addAddress);
router.put('/address/:index', protect, updateAddress);
router.delete('/address/:index', protect, deleteAddress);

export default router;