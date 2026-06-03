// // apps/payment-service/src/infrastructure/kafka/producer/payment.producer.ts

// import {
//   publish,
//   TOPICS,
//   EVENTS,
// } from '@org/shared-kafka';

// import logger from '@org/shared-logger';

// import { PaymentEntity } from '../../domain/entities/payment.entity';

// import { v4 as uuid } from 'uuid';

// export class PaymentProducer {

//   /**
//    * =========================================
//    * 💳 PAYMENT INITIATED
//    * =========================================
//    */

//   async paymentInitiated(
//     payment: PaymentEntity
//   ): Promise<void> {

//     try {

//       await publish({
//         topic: TOPICS.PAYMENTS,

//         key: payment.orderId,

//         message: {
//           eventId: uuid(),

//           event: EVENTS.PAYMENT_INITIATED,

//           version: 1,

//           timestamp:
//             new Date().toISOString(),

//           data: {
//             paymentId: payment.id,

//             orderId: payment.orderId,

//             userId: payment.userId,

//             amount: payment.amount,

//             currency: payment.currency,

//             status: payment.status,

//             paymentMethod:
//               payment.paymentMethod,
//           },

//           metadata: {
//             source: 'payment-service',
//           },
//         },
//       });

//       logger.info(
//         '✅ payment.initiated event published',
//         {
//           paymentId: payment.id,
//           orderId: payment.orderId,
//         }
//       );

//     } catch (error: any) {

//       logger.error(
//         '❌ Failed to publish payment.initiated',
//         {
//           paymentId: payment.id,
//           error: error.message,
//         }
//       );

//       throw error;
//     }
//   }

//   /**
//    * =========================================
//    * ✅ PAYMENT COMPLETED
//    * =========================================
//    */

//   async paymentCompleted(
//     payment: PaymentEntity
//   ): Promise<void> {

//     try {

//       await publish({
//         topic: TOPICS.PAYMENTS,

//         key: payment.orderId,

//         message: {
//           eventId: uuid(),

//           event: EVENTS.PAYMENT_COMPLETED,

//           version: 1,

//           timestamp:
//             new Date().toISOString(),

//           data: {
//             paymentId: payment.id,

//             orderId: payment.orderId,

//             userId: payment.userId,

//             amount: payment.amount,

//             currency: payment.currency,

//             stripePaymentIntentId:
//               payment.stripePaymentIntentId,

//             status: payment.status,
//           },

//           metadata: {
//             source: 'payment-service',
//           },
//         },
//       });

//       logger.info(
//         '✅ payment.completed event published',
//         {
//           paymentId: payment.id,
//           orderId: payment.orderId,
//         }
//       );

//     } catch (error: any) {

//       logger.error(
//         '❌ Failed to publish payment.completed',
//         {
//           paymentId: payment.id,
//           error: error.message,
//         }
//       );

//       throw error;
//     }
//   }

//   /**
//    * =========================================
//    * ❌ PAYMENT FAILED
//    * =========================================
//    */

//   async paymentFailed(
//     payment: PaymentEntity
//   ): Promise<void> {

//     try {

//       await publish({
//         topic: TOPICS.PAYMENTS,

//         key: payment.orderId,

//         message: {
//           eventId: uuid(),

//           event: EVENTS.PAYMENT_FAILED,

//           version: 1,

//           timestamp:
//             new Date().toISOString(),

//           data: {
//             paymentId: payment.id,

//             orderId: payment.orderId,

//             userId: payment.userId,

//             amount: payment.amount,

//             currency: payment.currency,

//             failureReason:
//               payment.metadata?.failureReason,
//           },

//           metadata: {
//             source: 'payment-service',
//           },
//         },
//       });

//       logger.warn(
//         '⚠️ payment.failed event published',
//         {
//           paymentId: payment.id,
//           orderId: payment.orderId,
//         }
//       );

//     } catch (error: any) {

//       logger.error(
//         '❌ Failed to publish payment.failed',
//         {
//           paymentId: payment.id,
//           error: error.message,
//         }
//       );

//       throw error;
//     }
//   }
// }

// export const paymentProducer =
//   new PaymentProducer();