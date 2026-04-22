// apps/payment-service/src/infrastructure/payments/stripe.adapter.ts

import Stripe from 'stripe';
import env from '../../config/env';
import logger from '@org/shared-logger';

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export class StripeAdapter {

  async createPaymentIntent(input: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
  }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency.toLowerCase(),
      metadata: {
        orderId: input.orderId,
        userId: input.userId,
      },
      automatic_payment_methods: { enabled: true },
    });

    logger.info('Stripe PaymentIntent created', {
      paymentIntentId: paymentIntent.id,
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }

  /**
   * 🔥 VERY IMPORTANT: Webhook signature verification
   */
  verifyWebhookSignature(payload: Buffer, signature: string) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error: any) {
      logger.error('Invalid Stripe webhook signature', {
        error: error.message,
      });
      throw new Error('Invalid webhook signature');
    }
  }
}