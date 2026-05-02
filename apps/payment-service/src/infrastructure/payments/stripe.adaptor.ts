import Stripe from 'stripe';
import logger from '@org/shared-logger';
import env from '../../config/env';
import { IPaymentProvider } from '../../application/interfaces/payment.provider';

type StripeEvent = ReturnType<
  InstanceType<typeof Stripe>['webhooks']['constructEvent']
>;

export class StripeAdapter implements IPaymentProvider {
  private stripe: InstanceType<typeof Stripe>;

  constructor() {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }

    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    });

    logger.info('✅ StripeAdapter initialized');
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentIntentId: string;
    clientSecret: string;
  }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency.toLowerCase(),
      metadata: {
        orderId: params.orderId,
        userId: params.userId,
        ...params.metadata,
      },
      automatic_payment_methods: { enabled: true },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Failed to create payment intent');
    }

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async verifyWebhookSignature(
    payload: Buffer | string,
    signature: string
  ): Promise<StripeEvent> {
    try {
      if (!env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is missing');
      }

      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error: any) {
      logger.error('Stripe webhook signature verification failed', {
        error: error.message,
      });

      throw new Error('Invalid webhook signature');
    }
  }
}