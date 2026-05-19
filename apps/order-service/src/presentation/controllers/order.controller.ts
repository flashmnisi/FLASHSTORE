import { Request, Response } from 'express';
//import { OrderService } from '../../application/services/order.service';
import { createOrderSchema } from '../../application/dtos/create-order.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';
//import logger from '@org/shared-logger';
import { OrderService } from '../../application/sevices/order.service';
import logger from '@org/shared-logger';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * =============================
   * 🟢 CREATE ORDER
   * =============================
   */
createOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const userId = req.headers['x-user-id'] as string;

    console.log('USER ID:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // ✅ ADD IT HERE (IMPORTANT)
    console.log('RAW BODY RECEIVED:', req.body);

    const dto = createOrderSchema.parse({
      ...req.body,
      userId,
    });

    console.log('FINAL DTO:', dto);

    const order =
      await this.orderService.createOrder(dto);

    return res.status(201).json({
      success: true,
      data: order,
    });

  } catch (error: any) {

    console.log(
      JSON.stringify(error, null, 2)
    );

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error?.flatten?.() || error.message,
    });
  }
};

  /**
   * =============================
   * 📦 GET ORDER BY ID
   * =============================
   */
/**
 * =============================
 * 📦 GET ORDER BY ID
 * =============================
 */
getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await this.orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Clean and consistent response
    return res.json({
      success: true,
      data: {
        id: order.id ,
        userId: order.userId,
        items: order.items,
        totalAmount: order.totalAmount,
        currency: order.currency || 'ZAR',
        status: order.status,
        paymentStatus: order.paymentStatus,
        idempotencyKey: order.idempotencyKey,
        //shippingAddress: order. || null,
        //paymentMethod: order.paymentMethod || null,
        //metadata: order.metadata || {},
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error: any) {
    logger.error('Get order by ID failed', { 
      orderId: req.params.id, 
      error: error.message 
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
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
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const orders = await this.orderService.getOrdersByUser(userId);

    return res.json({
      success: true,
      data: orders.map(order => ({
        id: order.id ,
        userId: order.userId,
        items: order.items,
        totalAmount: order.totalAmount,
        currency: order.currency || 'ZAR',
        status: order.status,
        paymentStatus: order.paymentStatus,
        idempotencyKey: order.idempotencyKey,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }))
    });
  } catch (error: any) {
    logger.error('Get user orders failed', { error: error.message });
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
}