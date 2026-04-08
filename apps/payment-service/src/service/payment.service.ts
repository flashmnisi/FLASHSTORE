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
    const paymentIntent = await stripe.paymentIntents.create({
      amount: dto.amount,
      currency: dto.currency.toLowerCase(),
      metadata: {
        orderId: dto.orderId,
        userId: dto.userId,
      },
      automatic_payment_methods: { enabled: true },
    });

    // Save payment record
    await Payment.create({
      order: dto.orderId,
      user: dto.userId,
      paymentIntentId: paymentIntent.id,
      amount: dto.amount,
      currency: dto.currency,
      status: 'pending',
      paymentMethod: 'card',
      metadata: { orderId: dto.orderId },
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
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const { orderId, userId } = intent.metadata;

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
      const intent = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { paymentIntentId: intent.id },
        { status: 'failed' }
      );

      await publishPaymentEvent(PAYMENT_EVENTS.PAYMENT_FAILED, {
        orderId: intent.metadata.orderId,
        paymentIntentId: intent.id,
      });
    }
  }
}

export const paymentService = new PaymentService();