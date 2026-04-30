// apps/user-service/src/infrastructure/kafka/producer/kafka.producer.ts

import { publish } from '@org/shared-kafka';
import { TOPICS } from '../topics/topics';
import logger from '@org/shared-logger';

export class KafkaProducer {
  async publishUserEvent(event: string, payload: any, key?: string) {
    try {
      await publish({
        topic: TOPICS.USERS,
        key: key || payload.userId,
        message: {
          event,
          data: payload,
          timestamp: new Date().toISOString(),
          source: 'user-service',
        },
      });

      logger.info(`Event published to ${TOPICS.USERS}`, { event, userId: payload.userId });
    } catch (error: any) {
      logger.error('Failed to publish user event', { event, error: error.message });
      throw error;
    }
  }

  async publishAuthEvent(event: string, payload: any) {
    try {
      await publish({
        topic: TOPICS.AUTH,
        key: payload.userId,
        message: {
          event,
          data: payload,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      logger.error('Failed to publish auth event', { event, error: error.message });
    }
  }
}

export const kafkaProducer = new KafkaProducer();