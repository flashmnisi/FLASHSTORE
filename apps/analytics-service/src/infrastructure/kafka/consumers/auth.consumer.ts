// // apps/analytics-service/src/infrastructure/kafka/consumers/auth.consumer.ts

// import { createConsumer, runConsumer,TOPICS, EVENTS } from '@org/shared-kafka';
// import { TrackUserRegistrationUseCase } from '../../../application/use-cases/track-user-registration.usecase';
// import logger from '@org/shared-logger';

// export class AuthEventsConsumer {
//   constructor(private readonly trackUserRegistration: TrackUserRegistrationUseCase) {}

//   async start() {
//     const consumer = createConsumer({
//       groupId: 'analytics-auth-events',
//       topics: [TOPICS.AUTH],
//       serviceName: 'analytics-service',
//     });

//     await runConsumer(
//       consumer,
//       {
//         groupId: 'analytics-auth-events',
//         topics: [TOPICS.AUTH],
//         serviceName: 'analytics-service',
//       },
//       async (event: any) => {
//         try {
//           const { event: eventType, data } = event;

//           if (eventType === EVENTS.USER_LOGGED_IN) {
//             await this.trackUserRegistration.execute({
//               userId: data.userId,
//               email: data.email,
//               name: data.name,
//             });
//           }
//         } catch (error: any) {
//           logger.error('Failed to process user event', {
//             eventType: event.event,
//             error: error.message,
//           });
//           throw error;
//         }
//       }
//     );

//     logger.info('✅ User Events Consumer started');
//   }
// }