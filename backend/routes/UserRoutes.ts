import express from 'express';
import {
  addAddress,
  deleteAddress,
  forgotPassword,
  getAddresses,
  loginUser,
  RegisterUser,
  resetPassword,
  updateAddress,
  updateProfile,
  deleteUser,
  verifyResetOtp,
} from '../controllers/UserController';
import { protect } from '../middleware/authMiddleware';
import { clearUserOrders, createOrder, getUserOrders } from '../controllers/OrderController';
import { addToLoved, removeFromLoved, getLovedItems, clearLovedItems } from '../controllers/LovedController'; 

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/verify-otp', verifyResetOtp);
router.post('/resetPassword', resetPassword);
router.post('/address', protect, addAddress);
router.get('/addresses', protect, getAddresses);
router.put('/address/:index', protect, updateAddress);
router.delete('/address/:index', protect, deleteAddress);
router.post('/order', protect, createOrder);
router.get('/orders', protect, getUserOrders);
router.delete('/orders/clear', protect, clearUserOrders);
router.post('/loved', protect, addToLoved);
router.post('/remove', protect, removeFromLoved);
router.get('/loved', protect, getLovedItems);
router.put('/profile', protect, updateProfile);
router.delete('/delete', protect, deleteUser);
router.delete('/loved/clear', protect, clearLovedItems); 

export { router as UserRoutes };