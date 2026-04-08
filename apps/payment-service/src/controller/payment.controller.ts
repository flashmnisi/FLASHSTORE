import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { createPaymentIntentSchema } from './payment.dto';
import logger from '@org/shared-logger';

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const dto = createPaymentIntentSchema.parse(req.body);
    const result = await paymentService.createPaymentIntent(dto);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create payment intent failed');
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrderWithPayment = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const result = await paymentService.createOrderWithPayment(req.user.userId, req.body);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create order with payment failed');
    res.status(500).json({ success: false, message: 'Server error' });
  }
};