// // apps/analytics-service/src/infrastructure/kafka/consumers/payment.consumer.ts

// import { createConsumer, runConsumer,TOPICS, EVENTS } from '@org/shared-kafka';
// import { TrackPaymentSuccessUseCase } from '../../../application/use-cases/track-payment-success.usecase';
// import logger from '@org/shared-logger';

// export class PaymentEventsConsumer {
//   constructor(private readonly trackPaymentSuccess: TrackPaymentSuccessUseCase) {}

//   async start() {
//     const consumer = createConsumer({
//       groupId: 'analytics-payment-events',
//       topics: [TOPICS.PAYMENTS],
//       serviceName: 'analytics-service',
//     });

//     await runConsumer(
//       consumer,
//       {
//         groupId: 'analytics-payment-events',
//         topics: [TOPICS.PAYMENTS],
//         serviceName: 'analytics-service',
//       },
//       async (event: any) => {
//         try {
//           const { event: eventType, data } = event;

//           if (eventType === EVENTS.PAYMENT_COMPLETED) {
//             await this.trackPaymentSuccess.execute({
//               paymentId: data.paymentId,
//               orderId: data.orderId,
//               userId: data.userId,
//               amount: data.amount,
//             });
//           }
//         } catch (error: any) {
//           logger.error('Failed to process payment event', {
//             eventType: event.event,
//             error: error.message,
//           });
//           throw error;
//         }
//       }
//     );

//     logger.info('✅ Payment Events Consumer started');
//   }
// }