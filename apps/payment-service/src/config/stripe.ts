// // apps/payment-service/src/config/stripe.ts

// import Stripe from 'stripe';
// import env from './env';
// import logger from '@org/shared-logger';


// let stripeInstance: Stripe | null = null;

// export const getStripe = (): Stripe => {
//   if (!stripeInstance) {
//     stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
//       apiVersion: '2026-03-25.dahlia',
//     });

//     logger.info('💳 Stripe initialized');
//   }

//   return stripeInstance;
// };