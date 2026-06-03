// // apps/cart-service/src/infrastructure/kafka/producer.ts

// import {
//   publish,
//   TOPICS,
//   EVENTS,
// } from '@org/shared-kafka';

// import logger from '@org/shared-logger';

// export class CartProducer {

//   /**
//    * =========================================
//    * 🛒 CART UPDATED
//    * =========================================
//    */
//   async cartUpdated(payload: any) {

//     try {

//       await publish({
//         topic: TOPICS.CARTS,

//         key: payload.userId,

//         message: {
//           event: EVENTS.CART_UPDATED,

//           version: 1,

//           timestamp: new Date().toISOString(),

//           data: {
//             userId: payload.userId,
//             cartId: payload.cartId,
//             items: payload.items || [],
//             totalAmount: payload.totalAmount || 0,
//           },

//           metadata: {
//             source: 'cart-service',
//           },
//         },
//       });

//       logger.info('✅ cart.updated event published', {
//         userId: payload.userId,
//       });

//     } catch (error: any) {

//       logger.error('❌ Failed to publish cart.updated event', {
//         error: error.message,
//         userId: payload.userId,
//       });

//       throw error;
//     }
//   }

//   /**
//    * =========================================
//    * 🧹 CART CLEARED
//    * =========================================
//    */
//   async cartCleared(payload: any) {

//     try {

//       await publish({
//         topic: TOPICS.CARTS,

//         key: payload.userId,

//         message: {
//           event: EVENTS.CART_CLEARED,

//           version: 1,

//           timestamp: new Date().toISOString(),

//           data: {
//             userId: payload.userId,
//             cartId: payload.cartId,
//             orderId: payload.orderId,
//           },

//           metadata: {
//             source: 'cart-service',
//           },
//         },
//       });

//       logger.info('✅ cart.cleared event published', {
//         userId: payload.userId,
//         orderId: payload.orderId,
//       });

//     } catch (error: any) {

//       logger.error('❌ Failed to publish cart.cleared event', {
//         error: error.message,
//         userId: payload.userId,
//       });

//       throw error;
//     }
//   }
// }

// export const cartProducer = new CartProducer();