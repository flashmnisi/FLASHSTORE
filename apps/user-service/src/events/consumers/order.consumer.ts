// import { createConsumer, runConsumer } from '@org/shared-kafka';
// import logger from '@org/shared-logger';

// export const startOrderConsumer = async () => {
//   try {
//     const consumer = createConsumer({
//       groupId: 'user-service-order-group',
//       topics: ['flashstore.orders']
//     });

//     await runConsumer(consumer, {
//       groupId: 'user-service-order-group',
//       topics: ['flashstore.orders']
//     }, async (message) => {
//       // ✅ Fixed Pino logging: object first, then message
//       logger.info(
//         { 
//           event: message.event,
//           orderId: message.data?.orderId,
//           userId: message.data?.userId 
//         },
//         `User Service received order event: ${message.event}`
//       );

//       // Handle different order events
//       switch (message.event) {
//         case 'order.created':
//           logger.info(
//             { 
//               orderId: message.data?.orderId,
//               userId: message.data?.userId 
//             },
//             'New order created - updating user orders'
//           );
//           // TODO: Add order to user's orders array
//           break;

//         case 'order.status.updated':
//           logger.info(
//             { 
//               orderId: message.data?.orderId,
//               status: message.data?.status 
//             },
//             'Order status updated'
//           );
//           break;

//         default:
//           logger.info(
//             { event: message.event },
//             'Unknown order event received'
//           );
//       }
//     });

//     logger.info('👥 Order consumer started in user-service');
//   } catch (error: any) {
//     logger.error(
//       { error: error.message },
//       'Failed to start order consumer'
//     );
//   }
// };