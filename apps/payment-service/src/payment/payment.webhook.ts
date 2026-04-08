import { Request, Response } from 'express';
import Stripe from 'stripe';
import logger from '@org/shared-logger';
import { env } from 'process';
import { paymentService } from '../service/payment.service';

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET!  
    );
  } catch (err: any) {
    logger.error({ error: err.message }, 'Webhook signature verification failed');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await paymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (err: any) {
    logger.error({ error: err.message }, 'Webhook processing failed');
    res.status(500).send('Webhook processing failed');
  }
};