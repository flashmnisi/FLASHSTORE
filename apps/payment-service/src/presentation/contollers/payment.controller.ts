import { Request, Response } from 'express';
import { PaymentService } from '../../application/services/payment.service';
import { processPaymentSchema } from '../../application/dtos/process-payment.dto';
import { stripeWebhookSchema } from '../../application/dtos/webhook.dto';
import logger from '../../utils/logger';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /payments
   * Create & process payment
   */
  processPayment = async (req: Request, res: Response) => {
    try {
      const parsed = processPaymentSchema.parse(req.body);

      const result = await this.paymentService.processPayment(parsed);

      return res.status(201).json({
        success: true,
        message: 'Payment initiated successfully',
        data: result,
      });
    } catch (error: any) {
      logger.error('Process payment failed', {
        error: error.message,
        body: req.body,
      });

      return res.status(400).json({
        success: false,
        message: error.message || 'Invalid request',
      });
    }
  };

  /**
   * POST /payments/webhook
   * Stripe webhook handler
   */
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      const payload = req.body;

      const parsed = stripeWebhookSchema.parse(payload);

      await this.paymentService.handleWebhook(parsed, signature);

      return res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error('Webhook handling failed', {
        error: error.message,
      });

      return res.status(400).json({
        success: false,
        message: 'Webhook error',
      });
    }
  };

  /**
   * GET /payments/:orderId
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
      logger.error('Get payment failed', {
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