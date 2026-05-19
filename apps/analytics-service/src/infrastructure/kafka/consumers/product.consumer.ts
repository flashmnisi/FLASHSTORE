// // apps/analytics-service/src/infrastructure/kafka/consumers/product.consumer.ts

// import { createConsumer, runConsumer,TOPICS, EVENTS } from '@org/shared-kafka';
// import { TrackProductViewUseCase } from '../../../application/use-cases/track-product-view.usecase';
// import logger from '@org/shared-logger';

// export class ProductEventsConsumer {
//   constructor(private readonly trackProductView: TrackProductViewUseCase) {}

//   async start() {
//     const consumer = createConsumer({
//       groupId: 'analytics-product-events',
//       topics: [TOPICS.PRODUCTS],
//       serviceName: 'analytics-service',
//     });

//     await runConsumer(
//       consumer,
//       {
//         groupId: 'analytics-product-events',
//         topics: [TOPICS.PRODUCTS],
//         serviceName: 'analytics-service',
//       },
//       async (event: any) => {
//         try {
//           const { event: eventType, data } = event;

//           if (eventType === EVENTS.PRODUCT_VIEWED) {
//             await this.trackProductView.execute({
//               productId: data.productId,
//               userId: data.userId,
//             });
//           }
//         } catch (error: any) {
//           logger.error('Failed to process product event', {
//             eventType: event.event,
//             error: error.message,
//           });
//           throw error;
//         }
//       }
//     );

//     logger.info('✅ Product Events Consumer started');
//   }
// }