// apps/payment-service/src/application/services/payment.service.ts

import { validators } from '../../utils/validators';
import { stripeWebhookSchema } from '../dtos/webhook.dto';
import { IPaymentRepository } from '../interfaces/payment.repository';
import { IPaymentProvider } from '../interfaces/payment.provider';
import { ProcessPaymentUseCase } from '../use-cases/process-payment.usecase';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import { EVENTS, TOPICS } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import {
  revenueTotal,
  paymentsTotal,
  paymentAmountTotal,
  paymentFailuresTotal,
} from '@org/shared-metrics';

export class PaymentService {
  private readonly processPaymentUseCase: ProcessPaymentUseCase;

  constructor(
    private readonly repository: IPaymentRepository,
    private readonly provider: IPaymentProvider,
    private readonly outboxService: OutboxService
  ) {
    this.processPaymentUseCase = new ProcessPaymentUseCase(
      repository,
      provider
    );
  }

  async createPaymentIntent(input: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }) {
    logger.info('Creating payment intent', {
      orderId: input.orderId,
      amount: input.amount,
    });

    return this.provider.createPaymentIntent({
      amount: input.amount,
      currency: input.currency,
      orderId: input.orderId,
      userId: input.userId,
    });
  }

  async processPayment(
    input: any,
    context?: {
      correlationId?: string;
    }
  ) {
    const validated = validators.processPayment.parse(input);
    return this.processPaymentUseCase.execute(validated, context);
  }

  async getPaymentByOrder(orderId: string) {
    const payment = await this.repository.findByOrderId(orderId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  async handleOrderCancelled(orderId: string) {
    try {
      const payment = await this.repository.findByOrderId(orderId);

      if (!payment) {
        logger.warn('No payment found for cancelled order', { orderId });
        return;
      }

      payment.markAsCanceled?.();
      await this.repository.update(payment);

      await this.outboxService.write({
        topic: TOPICS.PAYMENTS,
        event: EVENTS.PAYMENT_REFUNDED,
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          userId: payment.userId,
          amount: payment.amount,
          status: 'cancelled',
        },
        key: payment.id,
      });

      logger.info('✅ Payment cancelled due to order cancellation', {
        orderId,
      });
    } catch (error: any) {
      logger.error('Failed to handle order cancellation', {
        orderId,
        error: error.message,
      });
      throw error;
    }
  }

  async handleOrderCompleted(orderId: string) {
    try {
      const payment = await this.repository.findByOrderId(orderId);

      if (!payment) {
        logger.warn('No payment found for completed order', { orderId });
        return;
      }

      logger.info('✅ Order completed - payment already processed', {
        orderId,
        paymentId: payment.id,
      });
    } catch (error: any) {
      logger.error('Failed to handle order completion', {
        orderId,
        error: error.message,
      });
    }
  }

  /**
   * =====================================
   * HANDLE STRIPE WEBHOOK
   * =====================================
   */
  async handleWebhook(input: any, signature: string) {
    try {
      const event = stripeWebhookSchema.parse(input);
      const paymentIntentId = event.data.object.id;

      if (!paymentIntentId) {
        logger.warn('Webhook received without paymentIntentId');
        return;
      }

      const payment = await this.repository.findByStripePaymentIntentId(
        paymentIntentId
      );

      if (!payment) {
        logger.warn('Payment not found for webhook', { paymentIntentId });
        return;
      }

      const currency = payment.currency || 'ZAR';
      const amount = Number(payment.amount) || 0;

      switch (event.type) {
        case 'payment_intent.succeeded': {
          payment.markSucceeded(paymentIntentId);
          await this.repository.update(payment);

          // ── Business metrics (confirmed money only) ──
          revenueTotal.inc(
            {
              service: 'payment-service',
              currency,
            },
            amount
          );

          paymentsTotal.inc({
            service: 'payment-service',
            provider: 'stripe',
            status: 'succeeded',
          });

          paymentAmountTotal.inc(
            {
              service: 'payment-service',
              provider: 'stripe',
              status: 'succeeded',
              currency,
            },
            amount
          );

          await this.outboxService.write({
            topic: TOPICS.PAYMENTS,
            event: EVENTS.PAYMENT_COMPLETED,
            data: {
              paymentId: payment.id,
              orderId: payment.orderId,
              userId: payment.userId,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              stripePaymentIntentId: paymentIntentId,
            },
            key: payment.id,
          });

          logger.info('Payment succeeded via webhook', {
            paymentId: payment.id,
            amount,
            currency,
          });

          break;
        }

        case 'payment_intent.payment_failed': {
          const reason =
            event.data.object.last_payment_error?.message || 'Unknown error';

          payment.markFailed(reason);
          await this.repository.update(payment);

          // ── Business metrics (failure) ──
          paymentFailuresTotal.inc({
            service: 'payment-service',
            provider: 'stripe',
          });

          paymentsTotal.inc({
            service: 'payment-service',
            provider: 'stripe',
            status: 'failed',
          });

          if (amount > 0) {
            paymentAmountTotal.inc(
              {
                service: 'payment-service',
                provider: 'stripe',
                status: 'failed',
                currency,
              },
              amount
            );
          }

          await this.outboxService.write({
            topic: TOPICS.PAYMENTS,
            event: EVENTS.PAYMENT_FAILED,
            data: {
              paymentId: payment.id,
              orderId: payment.orderId,
              userId: payment.userId,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              reason,
            },
            key: payment.id,
          });

          logger.warn('Payment failed via webhook', {
            paymentId: payment.id,
            reason,
          });

          break;
        }

        default:
          logger.info('Unhandled webhook event', {
            type: event.type,
          });
      }
    } catch (error: any) {
      logger.error('Webhook processing failed', {
        error: error.message,
        type: input?.type,
      });
      throw error;
    }
  }

  async createPaymentFromOrder(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency?: string;
    items?: any[];
    correlationId: string;
  }) {
    const dto = {
      orderId: data.orderId,
      userId: data.userId,
      amount: data.amount,
      currency: (data.currency || 'ZAR') as 'ZAR' | 'USD' | 'EUR' | 'GBP',
      paymentMethod: 'card' as const,
      metadata: {} as Record<string, any>,
    };

    logger.info('Auto-creating payment from order event', {
      orderId: data.orderId,
      userId: data.userId,
    });

    return this.processPayment(dto);
  }
}