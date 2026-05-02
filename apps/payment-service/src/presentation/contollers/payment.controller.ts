// apps/payment-service/src/presentation/controllers/payment.controller.ts

import { Request, Response } from 'express';
import { PaymentService } from '../../application/services/payment.service';
import { validators } from '../../utils/validators';
import logger from '@org/shared-logger';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /api/payments
   * Create and process a new payment
   */
  processPayment = async (req: Request, res: Response) => {
    try {
      // Use the new validator middleware style directly in controller
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
   * Stripe webhook handler (MUST be public + raw body)
   */
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
      }

      // Note: For Stripe webhooks, you should use raw body (not parsed JSON)
      // In Express, this usually requires `express.raw()` middleware for this route
      const event = req.body; // raw parsed body

      await this.paymentService.handleWebhook(event, signature);

      // Always return 200 to Stripe quickly
      return res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error('Stripe webhook handling failed', {
        error: error.message,
      });

      // Return 200 anyway so Stripe doesn't retry endlessly
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