// shared-kafka/src/dlq/dlq.consumer.ts

import { createConsumer, runConsumer } from '../client/consumer';
import logger from '@org/shared-logger';

interface DLQConsumerOptions {
  groupId: string;
  topics: string[];           // original topics (e.g. ['flashstore.orders'])
  serviceName: string;
  recoveryHandler?: (message: any) => Promise<boolean>; // return true if recovered
}

export const startDLQConsumer = async (options: DLQConsumerOptions) => {
  const dlqTopics = options.topics.map(t => `${t}.dlq`);

  await runConsumer(
    createConsumer({
      groupId: `${options.groupId}-dlq`,
      topics: dlqTopics,
      serviceName: options.serviceName,
    }),
    {
      groupId: `${options.groupId}-dlq`,
      topics: dlqTopics,
      serviceName: options.serviceName,
    },
    async (message: any) => {
      try {
        const originalTopic = message?.originalTopic || message?.topic?.replace('.dlq', '');

        logger.error('💀 DLQ Message Received', {
          dlqTopic: message?.topic,
          originalTopic,
          originalEvent: message?.originalEvent,
          retryCount: message?.metadata?.retryCount,
          correlationId: message?.metadata?.correlationId,
        });

        // Optional automatic recovery
        if (options.recoveryHandler) {
          const recovered = await options.recoveryHandler(message);
          if (recovered) {
            logger.info('♻️ DLQ Message recovered successfully', { originalTopic });
            return;
          }
        }

        // If not recovered, keep in DLQ or move to permanent storage
        logger.warn('📌 DLQ Message not auto-recovered - manual intervention needed', {
          originalTopic,
        });

      } catch (err: any) {
        logger.error('❌ DLQ Consumer handler failed', { error: err.message });
      }
    }
  );

  logger.info('🚀 DLQ Consumer started', { 
    dlqTopics,
    serviceName: options.serviceName 
  });
};

// // shared-kafka/src/dlq/dlq.consumer.ts

// import { createConsumer, runConsumer } from '../client/consumer';
// import logger from '@org/shared-logger';

// interface DLQConsumerOptions {
//   groupId: string;
//   topics: string[];
//   serviceName: string;
//   handler?: (message: any) => Promise<void>;
// }

// export const startDLQConsumer = async ({
//   groupId,
//   topics,
//   serviceName,
//   handler,
// }: DLQConsumerOptions) => {

//   /**
//    * Convert:
//    * flashstore.auth
//    * ->
//    * flashstore.auth.dlq
//    */
//   const dlqTopics = topics.map(topic => `${topic}.dlq`);

//   const consumer = createConsumer({
//     groupId: `${groupId}-dlq`,
//     topics: dlqTopics,
//     serviceName,
//   });

//   await runConsumer(
//     consumer,
//     {
//       groupId: `${groupId}-dlq`,
//       topics: dlqTopics,
//       serviceName,
//     },
//     async (message: any) => {
//       try {
//         logger.error('💀 DLQ message received', {
//           topic: message?.topic,
//           event: message?.originalMessage?.event,
//           error: message?.error?.message,
//           correlationId: message?.metadata?.correlationId,
//         });

//         /**
//          * Optional recovery logic
//          */
//         if (handler) {
//           await handler(message);
//         }

//       } catch (error: any) {
//         logger.error('❌ DLQ handler failed', {
//           error: error.message,
//         });
//       }
//     }
//   );

//   logger.info('🚀 DLQ Consumer started', {
//     topics: dlqTopics,
//   });
// };