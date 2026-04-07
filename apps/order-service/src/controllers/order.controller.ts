import { Request, Response } from 'express';
import logger from '@org/shared-logger';
import { orderService } from '../services/order.service';

export const createOrder = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const order = await orderService.createOrder(req.user.userId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create order failed');
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    return res.status(200).json({ success: true, order });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};