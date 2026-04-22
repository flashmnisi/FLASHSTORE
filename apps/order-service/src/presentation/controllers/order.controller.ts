import { Request, Response } from 'express';
import { OrderService } from '../../application/services/order.service';
import { createOrderSchema } from '../../application/dtos/create-order.dto';
import logger from '../../utils/logger';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * =============================
   * 🟢 CREATE ORDER
   * =============================
   */
  createOrder = async (req: AuthRequest, res: Response) => {
    try {
      const correlationId = (req as any).correlationId;

      const dto = createOrderSchema.parse({
        ...req.body,
        userId: req.user?.userId, // enforce from token
      });

      const order = await this.orderService.createOrder(dto, {
        correlationId,
      });

      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      logger.error('Create order controller failed', {
        error: error.message,
      });

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * =============================
   * 📦 GET ORDER BY ID
   * =============================
   */
  getOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const order = await this.orderService.getOrderById(id);

      return res.json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * =============================
   * 📜 GET USER ORDERS
   * =============================
   */
  getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      const orders = await this.orderService.getOrdersByUser(userId!);

      return res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}