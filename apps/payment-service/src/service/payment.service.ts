// apps/payment-service/src/modules/payment/payment.service.ts
import Stripe from 'stripe';
import logger from '@org/shared-logger';
import { env } from 'process';
import { PAYMENT_EVENTS } from '../constant/topics';
import { publishPaymentEvent } from '../kafka/producer';
import { Payment } from '../model/payment.model';

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export class PaymentService {
  async createPaymentIntent(dto: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: dto.amount,
        currency: dto.currency.toLowerCase(),
        metadata: {
          orderId: dto.orderId,
          userId: dto.userId,
        },
        automatic_payment_methods: { enabled: true },
      });

      await Payment.create({
        order: dto.orderId,
        user: dto.userId,
        paymentIntentId: paymentIntent.id,
        amount: dto.amount,
        currency: dto.currency,
        status: 'pending',
        paymentMethod: 'card',
        metadata: { orderId: dto.orderId, userId: dto.userId },
      });

      logger.info(
        { paymentIntentId: paymentIntent.id, orderId: dto.orderId },
        'Stripe Payment Intent created and saved'
      );

      await publishPaymentEvent(PAYMENT_EVENTS.PAYMENT_INITIATED, {
        paymentIntentId: paymentIntent.id,
        orderId: dto.orderId,
        userId: dto.userId,
        amount: dto.amount,
      });

      return {
        client_secret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message, orderId: dto.orderId },
        'Failed to create Stripe Payment Intent'
      );
      throw error;
    }
  }

    async createOrderWithPayment(userId: string, dto: any) {
    try {
      // For now, we just create the payment intent
      // You can extend this later to also create the order
      const paymentResult = await this.createPaymentIntent({
        amount: dto.amount || 0,
        currency: dto.currency || 'usd',
        orderId: dto.orderId,
        userId: userId,
      });

      return paymentResult;
    } catch (error: any) {
      logger.error(
        { error: error.message, userId },
        'Failed to create order with payment'
      );
      throw error;
    }
  }

  async handleWebhook(event: any) {   // Changed from Stripe.Event to any to avoid type issues
    try {
      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as any;
        const { orderId, userId } = intent.metadata || {};

        await Payment.findOneAndUpdate(
          { paymentIntentId: intent.id },
          { status: 'succeeded' }
        );

        await publishPaymentEvent(PAYMENT_EVENTS.PAYMENT_COMPLETED, {
          orderId,
          userId,
          paymentIntentId: intent.id,
          amount: intent.amount,
          status: 'paid',
        });

        logger.info({ orderId, paymentIntentId: intent.id }, 'Payment completed successfully');
      }

      if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object as any;
        const { orderId } = intent.metadata || {};

        await Payment.findOneAndUpdate(
          { paymentIntentId: intent.id },
          { status: 'failed' }
        );

        await publishPaymentEvent(PAYMENT_EVENTS.PAYMENT_FAILED, {
          orderId,
          paymentIntentId: intent.id,
          status: 'failed',
        });
      }
    } catch (error: any) {
      logger.error(
        { error: error.message, eventType: event.type },
        'Failed to handle Stripe webhook'
      );
    }
  }
}

export const paymentService = new PaymentService();