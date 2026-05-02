// import Stripe from 'stripe';
// import env from '../../config/env';
// import logger from '@org/shared-logger';
// import { publish } from '@org/shared-kafka';
// import { TOPICS, EVENTS } from '@org/shared-kafka';
// import { idempotencyService } from '@org/shared-kafka'; // if shared service exists

// const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-06-30.basil',
// });

// export class StripeWebhookHandler {
//   /**
//    * Verify Stripe webhook signature (CRITICAL SECURITY STEP)
//    */
//   verifySignature(rawBody: string, signature: string) {
//     try {
//       return stripe.webhooks.constructEvent(
//         rawBody,
//         signature,
//         env.STRIPE_WEBHOOK_SECRET!
//       );
//     } catch (error: any) {
//       logger.error('❌ Stripe signature verification failed', {
//         error: error.message,
//       });
//       throw new Error('Invalid Stripe signature');
//     }
//   }

//   /**
//    * Main webhook processor
//    */
//   async handle(rawBody: string, signature: string, correlationId?: string) {
//     const event = this.verifySignature(rawBody, signature);

//     logger.info('📩 Stripe webhook received', {
//       type: event.type,
//       id: event.id,
//       correlationId,
//     });

//     // 🛑 Idempotency (VERY IMPORTANT)
//     const isDuplicate = await idempotencyService.isDuplicate(
//       event.id,
//       'payment-service'
//     );

//     if (isDuplicate) {
//       logger.warn('🔄 Duplicate Stripe event ignored', {
//         eventId: event.id,
//       });
//       return;
//     }

//     switch (event.type) {
//       /**
//        * PAYMENT SUCCESS
//        */
//       case 'payment_intent.succeeded': {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;

//         await publish({
//           topic: TOPICS.PAYMENTS,
//           key: paymentIntent.id,
//           message: {
//             event: EVENTS.PAYMENT_SUCCESS,
//             paymentIntentId: paymentIntent.id,
//             orderId: paymentIntent.metadata.orderId,
//             userId: paymentIntent.metadata.userId,
//             amount: paymentIntent.amount / 100,
//             currency: paymentIntent.currency,
//           },
//         });

//         logger.info('💰 Payment succeeded event published', {
//           paymentIntentId: paymentIntent.id,
//         });

//         break;
//       }

//       /**
//        * PAYMENT FAILED
//        */
//       case 'payment_intent.payment_failed': {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;

//         await publish({
//           topic: TOPICS.PAYMENTS,
//           key: paymentIntent.id,
//           message: {
//             event: EVENTS.PAYMENT_FAILED,
//             paymentIntentId: paymentIntent.id,
//             orderId: paymentIntent.metadata.orderId,
//             userId: paymentIntent.metadata.userId,
//             error: paymentIntent.last_payment_error?.message,
//           },
//         });

//         logger.warn('❌ Payment failed event published', {
//           paymentIntentId: paymentIntent.id,
//         });

//         break;
//       }

//       default:
//         logger.info('ℹ️ Unhandled Stripe event', {
//           type: event.type,
//         });
//     }
//   }
// }

// export const stripeWebhookHandler = new StripeWebhookHandler();