import { Router } from 'express';
import { validate } from '../../utils/validators';
import { OrderService } from '../../application/sevices/order.service';
import { OrderRepositoryImpl } from '../../infrastructure/persistance/repositories/oder.repository.impl';
import { extractUser } from '../../middlewares/auth.middleware';
import validators from '../../utils/validators';
import { OrderController } from '../controllers/order.controller';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { OutboxRepository } from '../../infrastructure/outbox/outbox.repository';

const router = Router();

const outboxRepository = new OutboxRepository();
const orderRepository = new OrderRepositoryImpl();
const outboxService = new OutboxService(outboxRepository);
const orderService = new OrderService(orderRepository, outboxService);
const controller = new OrderController(orderService);

// Routes
router.post(
  '/',
  extractUser,
  validate(validators.createOrder),
  controller.createOrder
);
router.get('/:id', extractUser, controller.getOrderById);
router.get('/user/me', extractUser, controller.getUserOrders);

export default router;
