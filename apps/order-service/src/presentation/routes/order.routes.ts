import { Router } from "express";
import { validate } from "../../utils/validators";
import { OrderService } from "../../application/sevices/order.service";
import { OrderRepositoryImpl } from "../../infrastructure/persistance/repositories/oder.repository.impl";
import { extractUser } from "../../middlewares/auth.middleware";
import validators from "../../utils/validators";
import { OrderController } from "../controllers/order.controller";

const router = Router();

const orderRepository = new OrderRepositoryImpl();
const orderService = new OrderService(orderRepository);
const controller = new OrderController(orderService);

// Routes
router.post('/', extractUser, validate(validators.createOrder), controller.createOrder);
router.get('/:id', extractUser, controller.getOrderById);
router.get('/user/me', extractUser, controller.getUserOrders);

export default router;