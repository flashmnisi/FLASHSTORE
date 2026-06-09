// // apps/analytics-service/src/infrastructure/kafka/consumers/order.consumer.ts

// import { createConsumer, runConsumer, TOPICS, EVENTS } from '@org/shared-kafka';
// import { TrackOrderCreatedUseCase } from '../../../application/use-cases/track-order-created.usecase';
// import logger from '@org/shared-logger';

// export class OrderEventsConsumer {
//   constructor(
//     private readonly trackOrderCreated: TrackOrderCreatedUseCase
//   ) {}

//   async start() {
//     const consumer = createConsumer({
//       groupId: 'analytics-order-events',
//       topics: [TOPICS.ORDERS],
//       serviceName: 'analytics-service',
//     });

//     await runConsumer(
//       consumer,
//       {
//         groupId: 'analytics-order-events',
//         topics: [TOPICS.ORDERS],
//         serviceName: 'analytics-service',
//       },
//       async (event: any) => {
//         try {
//           // =========================
//           // NORMALIZE EVENT (FIX)
//           // =========================
//           const eventType =
//             event.event ||
//             event.type ||
//             event.payload?.event;

//           const data =
//             event.data ||
//             event.payload?.data ||
//             event;

//           // =========================
//           // ORDER CREATED
//           // =========================
//           if (eventType === EVENTS.ORDER_CREATED) {
//             logger.info('📦 Processing order.created event', {
//               orderId: data.orderId || data.id,
//               userId: data.userId,
//             });

//             await this.trackOrderCreated.execute({
//               orderId: data.orderId || data.id,
//               userId: data.userId,
//               totalAmount: data.totalAmount,
//               itemCount: data.items?.length || 0,
//               createdAt: data.createdAt || new Date(),
//             });

//             logger.info('📊 Order tracking completed', {
//               orderId: data.orderId || data.id,
//             });
//           }

//         } catch (error: any) {
//           logger.error('Failed to process order event', {
//             eventType: event?.event,
//             error: error.message,
//           });
//           throw error;
//         }
//       }
//     );

//     logger.info('✅ Order Events Consumer started');
//   }
// }

