// import { publish } from '@org/shared-kafka';
// import logger from '@org/shared-logger';
// import { TOPICS, EVENT_TYPES } from '../../constant/topics';

// /**
//  * Publish event when a new user is registered
//  */
// export const publishUserRegisteredEvent = async (user: any) => {
//   try {
//     await publish({
//       topic: TOPICS.USERS,                    // ← Updated to use constant
//       message: {
//         event: EVENT_TYPES.USER_REGISTERED,    // ← Updated to use constant
//         data: {
//           userId: user._id,
//           email: user.email,
//           name: user.name,
//           role: user.role || 'user',
//         },
//         source: 'user-service',
//         timestamp: new Date().toISOString(),
//       },
//       key: String(user._id),
//     });

//     logger.info(
//       { 
//         userId: user._id, 
//         email: user.email 
//       },
//       '✅ Published user.registered event'
//     );
//   } catch (error: any) {
//     logger.error(
//       { 
//         error: error.message, 
//         userId: user._id 
//       },
//       'Failed to publish user.registered event'
//     );
//   }
// };

// /**
//  * Publish event when user profile is updated
//  */
// export const publishUserUpdatedEvent = async (user: any) => {
//   try {
//     await publish({
//       topic: TOPICS.USERS,
//       message: {
//         event: EVENT_TYPES.USER_UPDATED,
//         data: {
//           userId: user._id,
//           email: user.email,
//           name: user.name,
//           updatedAt: new Date().toISOString(),
//         },
//         source: 'user-service',
//       },
//       key: String(user._id),
//     });

//     logger.info(
//       { userId: user._id },
//       '✅ Published user.updated event'
//     );
//   } catch (error: any) {
//     logger.error(
//       { 
//         error: error.message, 
//         userId: user._id 
//       },
//       'Failed to publish user.updated event'
//     );
//   }
// };

// /**
//  * Publish event when user is deleted
//  */
// export const publishUserDeletedEvent = async (userId: string) => {
//   try {
//     await publish({
//       topic: TOPICS.USERS,
//       message: {
//         event: EVENT_TYPES.USER_DELETED,   // Better constant
//         data: {
//           userId,
//           timestamp: new Date().toISOString(),
//         },
//         source: 'user-service',
//       },
//       key: userId,
//     });

//     logger.info(
//       { userId },
//       '✅ Published user.deleted event'
//     );
//   } catch (error: any) {
//     logger.error(
//       { 
//         error: error.message, 
//         userId 
//       },
//       'Failed to publish user.deleted event'
//     );
//   }
// };