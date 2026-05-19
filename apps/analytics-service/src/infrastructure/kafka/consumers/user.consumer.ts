// // apps/analytics-service/src/infrastructure/kafka/consumers/user.consumer.ts

// import { createConsumer, runConsumer, TOPICS, EVENTS } from '@org/shared-kafka';
// import { TrackUserRegistrationUseCase } from '../../../application/use-cases/track-user-registration.usecase';
// import logger from '@org/shared-logger';

// export class UserEventsConsumer {
//   constructor(
//     private readonly trackUserRegistration: TrackUserRegistrationUseCase
//   ) {}

//   async start() {
//     const consumer = createConsumer({
//       groupId: 'analytics-user-events',
//       topics: [TOPICS.USERS, TOPICS.AUTH],
//       serviceName: 'analytics-service',
//     });

//     await runConsumer(
//       consumer,
//       {
//         groupId: 'analytics-user-events',
//         topics: [TOPICS.USERS, TOPICS.AUTH],
//         serviceName: 'analytics-service',
//       },
//       async (event: any) => {
//         try {
//           const eventType = event.event || event.type;
//           const data = event.data || event.payload || event;

//           // =========================
//           // USER REGISTERED
//           // =========================
//           if (eventType === EVENTS.USER_REGISTERED) {
//             await this.trackUserRegistration.execute({
//               userId: data.userId,
//               email: data.email,
//               name: data.name,
//               timestamp: new Date(),
//             });

//             logger.info('📊 User registered tracked', { userId: data.userId });
//           }

//           // =========================
//           // USER LOGGED IN (same use case)
//           // =========================
//           if (eventType === EVENTS.USER_LOGGED_IN) {
//             await this.trackUserRegistration.execute({
//               userId: data.userId,
//               email: data.email,
//               name: data.name,
//               timestamp: new Date(),
//             });

//             logger.info('📊 User login tracked', { userId: data.userId });
//           }

//         } catch (error: any) {
//           logger.error('Failed to process user event', {
//             eventType: event?.event,
//             error: error.message,
//           });
//           throw error;
//         }
//       }
//     );

//     logger.info('✅ User Events Consumer started');
//   }
// }