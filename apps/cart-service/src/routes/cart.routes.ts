import { Router } from 'express';
import { getUserCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.contoller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getUserCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router;