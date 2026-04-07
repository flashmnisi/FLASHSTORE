// apps/order-service/src/modules/order/order.controller.ts
import { Request, Response } from 'express';
import logger from '@org/shared-logger';
import { createOrderSchema } from '../dtos/order.dto';
import { orderService } from '../services/order.service';

export const createOrder = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const validatedData = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(req.user.userId, validatedData);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, userId: req.user?.userId },
      'Create order failed'
    );

    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create order' 
    });
  }
};

export const getUserOrders = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const orders = await orderService.getUserOrders(req.user.userId);

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      orders,
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, userId: req.user?.userId },
      'Get user orders failed'
    );
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const clearUserOrders = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await orderService.clearUserOrders(req.user.userId);

    return res.status(200).json({
      success: true,
      message: 'Orders cleared successfully',
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, userId: req.user?.userId },
      'Clear user orders failed'
    );
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};