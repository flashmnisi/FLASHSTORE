// apps/payment-service/src/modules/payment/payment.webhook.ts
import { Request, Response } from 'express';
import logger from '@org/shared-logger';
import { paymentService } from '../service/payment.service';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    await paymentService.handleWebhook(req.body);   // We pass raw body
    res.json({ received: true });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Webhook processing failed');
    res.status(400).send(`Webhook Error`);
  }
};