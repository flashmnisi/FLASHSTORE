// apps/payment-service/src/presentation/controllers/payment.controller.ts

import { Request, Response } from 'express';
import { PaymentService } from '../../application/services/payment.service';
import { validators } from '../../utils/validators';
import logger from '@org/shared-logger';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Create and process a new payment
   */
  processPayment = async (req: Request, res: Response) => {
    try {
      const validated = validators.processPayment.parse(req.body);

      const result = await this.paymentService.processPayment(validated);

      return res.status(201).json({
        success: true,
        message: 'Payment initiated successfully',
        data: result,
      });
    } catch (error: any) {
      logger.error('Process payment failed', {
        error: error.message,
        orderId: req.body?.orderId,
      });

      return res.status(400).json({
        success: false,
        message: error.message || 'Invalid payment request',
      });
    }
  };

  /**
   * POST /api/payments/webhook
   */
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        return res
          .status(400)
          .json({ error: 'Missing stripe-signature header' });
      }

      const event = req.body;

      await this.paymentService.handleWebhook(event, signature);

      return res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error('Stripe webhook handling failed', {
        error: error.message,
      });
      return res.status(200).json({ received: true });
    }
  };

  /**
   * GET /api/payments/:orderId
   */
  getPaymentByOrder = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      const payment = await this.paymentService.getPaymentByOrder(orderId);

      return res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      logger.error('Get payment by order failed', {
        error: error.message,
        orderId: req.params.orderId,
      });

      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }
  };
}
