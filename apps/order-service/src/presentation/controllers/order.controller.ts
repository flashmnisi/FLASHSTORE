// apps/order-service/src/presentation/controllers/order.controller.ts

import { Request, Response } from 'express';
import { createOrderSchema } from '../../application/dtos/create-order.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { OrderService } from '../../application/sevices/order.service';
import logger from '@org/shared-logger';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * =============================
   * 🟢 CREATE ORDER
   * =============================
   */
  createOrder = async (req: AuthRequest, res: Response) => {
    try {
      // Get user from JWT (via gateway middleware)
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User not found',
        });
      }

      // Enrich DTO with authenticated user data
      const dto = createOrderSchema.parse({
        ...req.body,
        userId: req.user.userId,
        userEmail: req.user.email,           // ← Critical for notifications
        customerName: req.body.customerName || req.user.name,
      });

      logger.info('Creating order', {
        userId: dto.userId,
        userEmail: dto.userEmail,
        itemsCount: dto.items.length,
        totalAmount: dto.totalAmount,
      });

      const order = await this.orderService.createOrder(dto, {
        correlationId: req.id,
      });

      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      logger.error('Create order failed', { error: error.message });

      if (error?.issues) {
        // Zod validation error
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.flatten?.() || error.issues,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create order',
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

      return res.json({
        success: true,
        data: {
          id: order.id,
          userId: order.userId,
          items: order.items,
          totalAmount: order.totalAmount,
          currency: order.currency || 'ZAR',
          status: order.status,
          paymentStatus: order.paymentStatus,
          idempotencyKey: order.idempotencyKey,
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
        return res.status(401).json({ 
          success: false, 
          message: "User not authenticated" 
        });
      }

      const orders = await this.orderService.getOrdersByUser(userId);

      return res.json({
        success: true,
        data: orders.map(order => ({
          id: order.id,
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
  };
}