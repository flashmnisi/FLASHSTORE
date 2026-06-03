// // apps/notification-service/src/infrastructure/kafka/producer.ts

// import {
//   publish,
//   TOPICS,
//   EVENTS,
// } from '@org/shared-kafka';

// import logger from '@org/shared-logger';

// import { NotificationEntity } from '../../domain/entities/notification.entity';

// import { v4 as uuid } from 'uuid';

// export class NotificationProducer {

//   /**
//    * =========================================
//    * ✅ NOTIFICATION SENT
//    * =========================================
//    */

//   async notificationSent(
//     notification: NotificationEntity
//   ): Promise<void> {

//     try {

//       await publish({
//         topic: TOPICS.NOTIFICATIONS,

//         key: notification.userId,

//         message: {
//           eventId: uuid(),

//           event: EVENTS.NOTIFICATION_SENT,

//           version: 1,

//           timestamp:
//             new Date().toISOString(),

//           data: {
//             notificationId: notification.id,

//             userId: notification.userId,

//             type: notification.type,

//             channel: notification.channel,

//             title: notification.title,

//             status: notification.status,
//           },

//           metadata: {
//             source: 'notification-service',
//           },
//         },
//       });

//       logger.info(
//         '✅ notification.sent published',
//         {
//           notificationId: notification.id,
//           userId: notification.userId,
//         }
//       );

//     } catch (error: any) {

//       logger.error(
//         '❌ Failed to publish notification.sent',
//         {
//           error: error.message,
//           notificationId: notification.id,
//         }
//       );

//       throw error;
//     }
//   }

//   /**
//    * =========================================
//    * ❌ NOTIFICATION FAILED
//    * =========================================
//    */

//   async notificationFailed(
//     notification: NotificationEntity,
//     errorMessage: string
//   ): Promise<void> {

//     try {

//       await publish({
//         topic: TOPICS.NOTIFICATIONS,

//         key: notification.userId,

//         message: {
//           eventId: uuid(),

//           event: EVENTS.NOTIFICATION_FAILED,

//           version: 1,

//           timestamp:
//             new Date().toISOString(),

//           data: {
//             notificationId: notification.id,

//             userId: notification.userId,

//             type: notification.type,

//             channel: notification.channel,

//             title: notification.title,

//             error: errorMessage,
//           },

//           metadata: {
//             source: 'notification-service',
//           },
//         },
//       });

//       logger.warn(
//         '⚠️ notification.failed published',
//         {
//           notificationId: notification.id,
//           userId: notification.userId,
//         }
//       );

//     } catch (error: any) {

//       logger.error(
//         '❌ Failed to publish notification.failed',
//         {
//           error: error.message,
//           notificationId: notification.id,
//         }
//       );

//       throw error;
//     }
//   }
// }

// export const notificationProducer =
//   new NotificationProducer();