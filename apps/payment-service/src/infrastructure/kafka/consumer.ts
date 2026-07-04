// apps/payment-service/src/infrastructure/kafka/consumer.ts

import {
  subscribe,
  EVENTS,
  TOPICS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { PaymentService } from '../../application/services/payment.service';

import { OrderCreatedHandler } from './handlers/order-created.handler';
import { OrderCancelledHandler } from './handlers/order-cancelled.handler';
import { OrderCompletedHandler } from './handlers/order-completed.handler';

export class PaymentConsumer {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  async start() {
    try {
      const orderCreatedHandler = new OrderCreatedHandler(this.paymentService);
      const orderCancelledHandler = new OrderCancelledHandler(this.paymentService);
      const orderCompletedHandler = new OrderCompletedHandler(this.paymentService); 

      await subscribe(
        {
          topics: [TOPICS.ORDERS],
          groupId: 'payment-service-group',
          serviceName: 'payment-service',
        },
        async (message: any) => {
          try {
            const eventType = message.event || message.type;
            const data = message.data || message.payload || message;

            switch (eventType) {
              case EVENTS.ORDER_CREATED:
                await orderCreatedHandler.handle({ ...message, data });
                break;

              case EVENTS.ORDER_CANCELLED:
                await orderCancelledHandler.handle({ ...message, data });
                break;

              case EVENTS.ORDER_COMPLETED:
                await orderCompletedHandler.handle({ ...message, data });
                break;

              default:
                logger.warn('⚠️ Unknown event received in payment consumer', {
                  event: eventType,
                });
            }
          } catch (error: any) {
            logger.error('❌ Error processing payment event', {
              event: message.event,
              error: error.message,
            });
          }
        }
      );

      logger.info('✅ Payment Consumer started successfully');
    } catch (error: any) {
      logger.error('❌ Failed to start Payment Consumer', { error: error.message });
      throw error;
    }
  }
}