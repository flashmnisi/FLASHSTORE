// shared-kafka/src/dlq/dlq.handler.ts

import { publish } from '../client/producer';
import logger from '@org/shared-logger';

export interface DLQOptions {
  topic: string;
  event: string;
  payload: any;
  key?: string;
  error: string | Error;
  retryCount?: number;
  correlationId?: string;
  traceId?: string;
  serviceName?: string;
  headers?: Record<string, any>;
}

export const sendToDLQ = async (options: DLQOptions): Promise<void> => {
  const dlqTopic = `${options.topic}.dlq`;

  const dlqMessage = {
    originalTopic: options.topic,
    originalEvent: options.event,
    originalKey: options.key,
    originalPayload: options.payload,

    error: {
      message: options.error instanceof Error ? options.error.message : options.error,
      stack: options.error instanceof Error ? options.error.stack : undefined,
      timestamp: new Date().toISOString(),
    },

    metadata: {
      retryCount: options.retryCount || 0,
      correlationId: options.correlationId,
      traceId: options.traceId,
      serviceName: options.serviceName,
      failedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
  };

  try {
    await publish({
      topic: dlqTopic,
      key: options.key,
      message: dlqMessage,
      headers: {
        ...options.headers,
        'x-dlq': 'true',
        'x-original-topic': options.topic,
        'x-retry-count': String(options.retryCount || 0),
        'x-correlation-id': options.correlationId || '',
        'x-trace-id': options.traceId || '',
      },
    });

    logger.warn('💀 Message moved to DLQ', {
      dlqTopic,
      originalTopic: options.topic,
      event: options.event,
      retryCount: options.retryCount,
      correlationId: options.correlationId,
    });
  } catch (err: any) {
    logger.error('🚨 CRITICAL - Failed to send to DLQ (Emergency)', {
      originalTopic: options.topic,
      event: options.event,
      error: err.message,
    });
    // TODO: Add fallback (Mongo emergency collection, Redis, etc.)
  }
};

// // shared-kafka/src/dlq/dlq.handler.ts

// import { publish } from '../client/producer';
// import logger from '@org/shared-logger';

// export interface DLQOptions {
//   topic: string;
//   event: string;
//   payload: any;

//   key?: string;

//   error: string;

//   retryCount?: number;

//   correlationId?: string;

//   traceId?: string;

//   serviceName?: string;

//   headers?: Record<string, any>;
// }

// export const sendToDLQ = async ({
//   topic,
//   event,
//   payload,
//   key,
//   error,
//   retryCount = 0,
//   correlationId,
//   traceId,
//   serviceName,
//   headers = {},
// }: DLQOptions) => {
//   const dlqTopic = `${topic}.dlq`;

//   const dlqPayload = {
//     originalTopic: topic,

//     originalEvent: event,

//     originalKey: key,

//     originalPayload: payload,

//     metadata: {
//       retryCount,

//       correlationId,

//       traceId,

//       serviceName,

//       failedAt: new Date().toISOString(),
//     },

//     error: {
//       message: error,
//     },
//   };

//   try {
//     await publish({
//       topic: dlqTopic,

//       key,

//       message: dlqPayload,

//       headers: {
//         ...headers,

//         'x-retry-count': String(retryCount),

//         'x-correlation-id': correlationId || '',

//         'x-trace-id': traceId || '',

//         'x-failed-reason': error,
//       },
//     });

//     logger.error('💀 Message sent to DLQ', {
//       dlqTopic,
//       originalTopic: topic,
//       event,
//       key,
//       retryCount,
//       correlationId,
//       traceId,
//       serviceName,
//     });
//   } catch (err: any) {
//     logger.error('🚨 CRITICAL: Failed to send message to DLQ', {
//       originalTopic: topic,
//       event,
//       key,
//       error: err.message,
//     });

//     /**
//      * Future Enterprise Upgrades
//      *
//      * 1. Write to Mongo fallback collection
//      * 2. Write to Redis emergency queue
//      * 3. Send Slack alert
//      * 4. Send PagerDuty alert
//      * 5. Send email to DevOps
//      */
//   }
// };