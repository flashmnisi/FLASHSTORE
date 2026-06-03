// // apps/order-service/src/infrastructure/kafka/producer.ts

// import { sendToOutbox } from '../outbox/outbox.processor';
// import { TOPICS, EVENTS } from '@org/shared-kafka';
// import logger from '@org/shared-logger';
// import { v4 as uuid } from 'uuid';

// export class OrderProducer {

//   /**
//    * ORDER CREATED
//    */
//   async orderCreated(payload: any) {
//     try {
//       const eventPayload = {
//         orderId: payload.orderId || payload.id,
//         userId: payload.userId,
//         email: payload.email,
//         name: payload.name || payload.user?.name,
//         items: payload.items || [],
//         totalAmount: payload.totalAmount,
//         currency: payload.currency || 'ZAR',
//         status: payload.status || 'pending',
//         shippingAddress: payload.shippingAddress || null,
//         createdAt: payload.createdAt || new Date().toISOString(),
//       };

//       await sendToOutbox({
//         topic: TOPICS.ORDERS,
//         event: EVENTS.ORDER_CREATED,
//         key: eventPayload.orderId,
//         correlationId: payload.correlationId || uuid(),
//         payload: {
//           eventId: uuid(),
//           version: 1,
//           timestamp: new Date().toISOString(),
//           data: eventPayload,
//           metadata: {
//             source: 'order-service',
//             serviceVersion: '1.0',
//           },
//         },
//       });

//       logger.info('📤 order.created queued in outbox', {
//         orderId: eventPayload.orderId,
//         userId: eventPayload.userId,
//       });
//     } catch (error: any) {
//       logger.error('❌ Failed to queue order.created', {
//         orderId: payload.orderId || payload.id,
//         error: error.message,
//       });
//       throw error;
//     }
//   }

//   /**
//    * ORDER UPDATED
//    */
//   async orderUpdated(payload: any) {
//     try {
//       const eventPayload = {
//         orderId: payload.orderId || payload.id,
//         userId: payload.userId,
//         status: payload.status,
//         totalAmount: payload.totalAmount,
//         updatedAt: payload.updatedAt || new Date().toISOString(),
//       };

//       await sendToOutbox({
//         topic: TOPICS.ORDERS,
//         event: EVENTS.ORDER_UPDATED,
//         key: eventPayload.orderId,
//         correlationId: payload.correlationId || uuid(),
//         payload: {
//           eventId: uuid(),
//           version: 1,
//           timestamp: new Date().toISOString(),
//           data: eventPayload,
//           metadata: { source: 'order-service' },
//         },
//       });

//       logger.info('📤 order.updated queued', {
//         orderId: eventPayload.orderId,
//         status: eventPayload.status,
//       });
//     } catch (error: any) {
//       logger.error('❌ Failed to queue order.updated', {
//         orderId: payload.orderId || payload.id,
//         error: error.message,
//       });
//       throw error;
//     }
//   }

//   /**
//    * ORDER CANCELLED
//    */
//   async orderCancelled(payload: any) {
//     try {
//       const eventPayload = {
//         orderId: payload.orderId || payload.id,
//         userId: payload.userId,
//         reason: payload.reason || 'Order cancelled by user',
//         status: 'cancelled',
//         cancelledAt: new Date().toISOString(),
//       };

//       await sendToOutbox({
//         topic: TOPICS.ORDERS,
//         event: EVENTS.ORDER_CANCELLED,
//         key: eventPayload.orderId,
//         correlationId: payload.correlationId || uuid(),
//         payload: {
//           eventId: uuid(),
//           version: 1,
//           timestamp: new Date().toISOString(),
//           data: eventPayload,
//           metadata: { source: 'order-service' },
//         },
//       });

//       logger.info('📤 order.cancelled queued', { orderId: eventPayload.orderId });
//     } catch (error: any) {
//       logger.error('❌ Failed to queue order.cancelled', {
//         orderId: payload.orderId || payload.id,
//         error: error.message,
//       });
//       throw error;
//     }
//   }

//   /**
//    * ORDER COMPLETED
//    */
//   async orderCompleted(payload: any) {
//     try {
//       const eventPayload = {
//         orderId: payload.orderId || payload.id,
//         userId: payload.userId,
//         totalAmount: payload.totalAmount,
//         status: 'completed',
//         completedAt: new Date().toISOString(),
//       };

//       await sendToOutbox({
//         topic: TOPICS.ORDERS,
//         event: EVENTS.ORDER_COMPLETED,
//         key: eventPayload.orderId,
//         correlationId: payload.correlationId || uuid(),
//         payload: {
//           eventId: uuid(),
//           version: 1,
//           timestamp: new Date().toISOString(),
//           data: eventPayload,
//           metadata: { source: 'order-service' },
//         },
//       });

//       logger.info('📤 order.completed queued', { orderId: eventPayload.orderId });
//     } catch (error: any) {
//       logger.error('❌ Failed to queue order.completed', {
//         orderId: payload.orderId || payload.id,
//         error: error.message,
//       });
//       throw error;
//     }
//   }
// }