import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { validate, validators } from '../../utils/validators';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

/**
 * =============================
 * Cart Routes
 * =============================
 */

// Add item to cart
router.post('/items', protect, validate(validators.addToCart), CartController.prototype.addToCart);

// Get user's cart
router.get('/', protect, CartController.prototype.getCart);

// Update item quantity
router.put('/items/:productId', protect, validate(validators.updateCartItem), CartController.prototype.updateCartItem);

// Remove item from cart
router.delete('/items/:productId', protect, CartController.prototype.removeFromCart);

// Clear entire cart
router.delete('/', protect, CartController.prototype.clearCart);

// Checkout cart (with optional coupon)
router.post('/checkout', protect, validate(validators.checkout), CartController.prototype.checkout);

export default router;