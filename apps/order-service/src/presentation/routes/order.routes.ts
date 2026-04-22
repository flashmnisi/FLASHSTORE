import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../../application/services/order.service';
import { protect } from '../../middlewares/auth.middleware';
import { validate, validators } from '../../utils/validators';

// repositories + producer (you’ll inject real implementations later)
import { OrderRepositoryImpl } from '../../infrastructure/persistence/repositories/order.repository.impl';
import { OrderProducer } from '../../infrastructure/kafka/producer';

const router = Router();

/**
 * =============================
 * Dependency Wiring (simple DI)
 * =============================
 */
const orderRepository = new OrderRepositoryImpl();
const orderProducer = new OrderProducer();

const orderService = new OrderService(orderRepository, orderProducer);
const controller = new OrderController(orderService);

/**
 * =============================
 * Routes
 * =============================
 */

// 🟢 Create Order
router.post(
  '/',
  protect,
  validate(validators.createOrder),
  controller.createOrder
);

// 📦 Get order by ID
router.get('/:id', protect, controller.getOrderById);

// 📜 Get user orders
router.get('/user/me', protect, controller.getUserOrders);

export default router;