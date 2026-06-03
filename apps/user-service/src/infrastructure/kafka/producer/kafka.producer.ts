// // apps/user-service/src/infrastructure/kafka/producer/kafka.producer.ts

// import {
//   publish,
//   TOPICS,
//   EVENTS,
// } from '@org/shared-kafka';

// import logger from '@org/shared-logger';

// export class KafkaProducer {

//   // =========================================
//   // USER EVENTS
//   // =========================================

//   async publishUserEvent(
//     event: string,
//     payload: any,
//     key?: string
//   ) {

//     try {

//       await publish({
//         topic: TOPICS.USERS,

//         key: key || payload.userId,

//         message: {
//           event,

//           version: 1,

//           timestamp: new Date().toISOString(),

//           data: payload,

//           metadata: {
//             source: 'user-service',
//           },
//         },
//       });

//       logger.info('✅ User event published', {
//         topic: TOPICS.USERS,
//         event,
//         userId: payload.userId,
//       });

//     } catch (error: any) {

//       logger.error('❌ Failed to publish user event', {
//         topic: TOPICS.USERS,
//         event,
//         error: error.message,
//       });

//       throw error;
//     }
//   }

//   // =========================================
//   // AUTH EVENTS
//   // =========================================

//   async publishAuthEvent(
//     event: string,
//     payload: any
//   ) {

//     try {

//       await publish({
//         topic: TOPICS.AUTH,

//         key: payload.userId,

//         message: {
//           event,

//           version: 1,

//           timestamp: new Date().toISOString(),

//           data: payload,

//           metadata: {
//             source: 'user-service',
//           },
//         },
//       });

//       logger.info('✅ Auth event published', {
//         topic: TOPICS.AUTH,
//         event,
//         userId: payload.userId,
//       });

//     } catch (error: any) {

//       logger.error('❌ Failed to publish auth event', {
//         topic: TOPICS.AUTH,
//         event,
//         error: error.message,
//       });

//       throw error;
//     }
//   }

//   // =========================================
//   // HELPERS
//   // =========================================

//   async userRegistered(payload: any) {
//     return this.publishUserEvent(
//       EVENTS.USER_REGISTERED,
//       payload
//     );
//   }

//   async userUpdated(payload: any) {
//     return this.publishUserEvent(
//       EVENTS.USER_UPDATED,
//       payload
//     );
//   }

//   async userDeleted(payload: any) {
//     return this.publishUserEvent(
//       EVENTS.USER_DELETED,
//       payload
//     );
//   }

//   async userLoggedIn(payload: any) {
//     return this.publishAuthEvent(
//       EVENTS.USER_LOGGED_IN,
//       payload
//     );
//   }
// }

// export const kafkaProducer = new KafkaProducer();