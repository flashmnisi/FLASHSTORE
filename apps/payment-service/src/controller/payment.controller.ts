// apps/payment-service/src/modules/payment/payment.controller.ts
import { Request, Response } from 'express';
import logger from '@org/shared-logger';
import { createPaymentIntentSchema } from '../dtos/payment.dto';
import { paymentService } from '../service/payment.service';


export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const dto = createPaymentIntentSchema.parse(req.body);

    const fullDto = {
      ...dto,
      orderId: req.body.orderId,
      userId: req.body.userId,
    };

    const result = await paymentService.createPaymentIntent(fullDto);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create payment intent failed');
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid payment data',
    });
  }
};

export const createOrderWithPayment = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const result = await paymentService.createOrderWithPayment(
      req.user.userId, 
      req.body
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create order with payment failed');
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};