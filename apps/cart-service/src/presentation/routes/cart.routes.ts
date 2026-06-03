import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { validate, validators } from '../../utils/validators';
import { protect } from '../../middleware/auth.middleware';
import { cartService } from '../../infrastructure/container/cart.container';

const router = Router();

// Create controller with injected service
const controller = new CartController(cartService);

router.post(
  '/items',
  protect,
  validate(validators.addToCart),
  controller.addToCart
);

router.get(
  '/',
  protect,
  controller.getCart
);

router.put(
  '/items/:productId',
  protect,
  validate(validators.updateCartItem),
  controller.updateCartItem
);

router.delete(
  '/items/:productId',
  protect,
  controller.removeFromCart
);

router.delete(
  '/',
  protect,
  controller.clearCart
);

router.post(
  '/checkout',
  protect,
  validate(validators.checkout),
  controller.checkout
);

export default router;