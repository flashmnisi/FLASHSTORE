import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  addToCart,
  clearCart,
  getUserCart,
  removeFromCart,
  updateCartItem,
  updateCartQuantity, 
} from '../controllers';

const router = express.Router();

router.get('/', protect, getUserCart); 
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.patch('/:productId', protect, updateCartQuantity); 
router.delete('/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);

export { router as CartRoutes };