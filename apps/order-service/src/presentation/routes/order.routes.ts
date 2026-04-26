import { Router } from "express";
import { validate } from "../../utils/validators";
import { OrderService } from "../../application/sevices/order.service";
import { OrderRepositoryImpl } from "../../infrastructure/persistance/repositories/oder.repository.impl";
import { protect } from "../../middlewares/auth.middleware";
import validators from "../../utils/validators";
import { OrderController } from "../controllers/order.controller";

const router = Router();

const orderRepository = new OrderRepositoryImpl();
const orderService = new OrderService(orderRepository);
const controller = new OrderController(orderService);

// Routes
router.post('/', protect, validate(validators.createOrder), controller.createOrder);
router.get('/:id', protect, controller.getOrderById);
router.get('/user/me', protect, controller.getUserOrders);

export default router;