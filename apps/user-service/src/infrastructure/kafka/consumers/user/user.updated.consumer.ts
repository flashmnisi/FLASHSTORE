// // apps/user-service/src/infrastructure/kafka/consumers/user/user.updated.consumer.ts

// import { createConsumer, runConsumer } from '@org/shared-kafka';
// import logger from '@org/shared-logger';
// import { USER_EVENTS } from '../../events/user.events';

// export const startUserUpdatedConsumer = async () => {
//   const consumer = createConsumer({
//     groupId: 'user-service-user-updated',
//     topics: ['flashstore.users'],
//     serviceName: 'user-service',
//   });

//   await runConsumer(
//     consumer,
//     {
//       groupId: 'user-service-user-updated',
//       topics: ['flashstore.users'],
//       serviceName: 'user-service',
//     },
//     async (event: any) => {
//       try {
//         if (event.event === USER_EVENTS.UPDATED) {
//           const { userId, updatedFields } = event.data;

//           logger.info('📥 Processing user.updated event', {
//             userId,
//             updatedFields: updatedFields || [],
//           });

//           // TODO: Sync with other services if needed (search index, cart, etc.)
//         }
//       } catch (error: any) {
//         logger.error('Failed to handle user.updated event', {
//           error: error.message,
//         });
//         throw error;
//       }
//     }
//   );

//   logger.info('✅ User Updated Consumer is running');
// };