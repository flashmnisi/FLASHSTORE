//libs/shared-kafka/src/messaging/message-handler.ts

import logger from 'src/utils/logger';
import { subscribe } from './subscribe';
//import logger from '@org/shared-logger';

export const createMessageHandler = () => {
  return {
    subscribe: async (
      topicConfig: {
        groupId: string;
        topics: string[];
        serviceName: string;
      },
      handler: (event: any) => Promise<void>
    ) => {
      logger.info('📡 Starting subscription', topicConfig);

      await subscribe(topicConfig, async (ctx) => {
        try {
          await handler(ctx.event);
        } catch (error: any) {
          logger.error('❌ Handler failed', {
            error: error.message,
            eventId: ctx.eventId,
          });

          throw error; // triggers retry + DLQ pipeline
        }
      });
    },
  };
};