// apps/analytics-service/src/infrastructure/kafka/consumers/order.consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import { TrackOrderCreatedUseCase } from '../../../application/use-cases/track-order-created.usecase';
import { TOPICS, EVENTS } from '../topics';
import logger from '@org/shared-logger';

export class OrderEventsConsumer {
  constructor(private readonly trackOrderCreated: TrackOrderCreatedUseCase) {}

  async start() {
    const consumer = createConsumer({
      groupId: 'analytics-order-events',
      topics: [TOPICS.ORDERS],
      serviceName: 'analytics-service',
    });

    await runConsumer(
      consumer,
      {
        groupId: 'analytics-order-events',
        topics: [TOPICS.ORDERS],
        serviceName: 'analytics-service',
      },
      async (event: any) => {
        try {
          const { event: eventType, data } = event;

          if (eventType === EVENTS.ORDER_CREATED) {
            await this.trackOrderCreated.execute({
              orderId: data.orderId,
              userId: data.userId,
              totalAmount: data.totalAmount,
              itemCount: data.items?.length || 0,
            });
          }
        } catch (error: any) {
          logger.error('Failed to process order event', {
            eventType: event.event,
            error: error.message,
          });
          throw error;
        }
      }
    );

    logger.info('✅ Order Events Consumer started');
  }
}