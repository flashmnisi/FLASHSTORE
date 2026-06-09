/**
 * Order Consumer - Improved Version
 */
import { subscribe, TOPICS, EVENTS } from '@org/shared-kafka';
import logger from '@org/shared-logger';

import { PaymentCompletedHandler } from './handlers/payment-completed.handler';
import { PaymentFailedHandler } from './handlers/payment-failed.handler';
import { OrderCancelledHandler } from './handlers/order-cancelled.handler';
import { OrderCreatedHandler } from './handlers/order-created.handler';
import { OrderCompletedHandler } from './handlers/order-completed.handler';
import { OrderUpdatedHandler } from './handlers/order-updated.hander';

export class OrderConsumer {
  constructor(
    private readonly paymentCompletedHandler: PaymentCompletedHandler,
    private readonly paymentFailedHandler: PaymentFailedHandler,
    private readonly orderCreatedHandler: OrderCreatedHandler,
    private readonly orderCancelledHandler: OrderCancelledHandler,
    private readonly orderCompletedHandler: OrderCompletedHandler,
    private readonly orderUpdatedHandler: OrderUpdatedHandler
  ) {}

  async start() {
    await subscribe(
      {
        topics: [TOPICS.ORDERS, TOPICS.PAYMENTS],
        groupId: 'order-service-group',
        serviceName: 'order-service',
      },
      async (message: any) => {
        try {
          // ====================== SAFE EXTRACTION ======================
          const eventType =
            message?.event ||
            message?.data?.event ||
            message?.event?.event ||
            message?.data?.data?.event;

          const payload =
            message?.data?.data ??
            message?.data ??
            message?.event?.data ??
            message;

          const topic = message?.topic;

          if (!eventType) {
            logger.warn('⚠️ Received message without event type', { topic });
            return;
          }

          logger.info('📥 Order consumer received event', {
            eventType,
            topic,
            eventId: message?.eventId || payload?.id,
          });

          // ====================== TOPIC VALIDATION ======================
          this.validateEventTopic(eventType, topic);

          // ====================== ROUTING ======================
          switch (eventType) {
            // === PAYMENT EVENTS ===
            case EVENTS.PAYMENT_COMPLETED:
              await this.paymentCompletedHandler.handle({
                ...message,
                data: payload,
              });
              break;

            case EVENTS.PAYMENT_FAILED:
              await this.paymentFailedHandler.handle({
                ...message,
                data: payload,
              });
              break;

            // === ORDER EVENTS ===
            case EVENTS.ORDER_CREATED:
              await this.orderCreatedHandler.handle({
                ...message,
                data: payload,
              });
              break;

            case EVENTS.ORDER_CANCELLED:
              await this.orderCancelledHandler.handle({
                ...message,
                data: payload,
              });
              break;

            case EVENTS.ORDER_COMPLETED:
              await this.orderCompletedHandler.handle({
                ...message,
                data: payload,
              });
              break;

            case EVENTS.ORDER_UPDATED:
              await this.orderUpdatedHandler.handle({
                ...message,
                data: payload,
              });
              break;

            default:
              if (this.isKnownEvent(eventType)) {
                logger.warn('⚠️ Event not handled by order-service', {
                  eventType,
                  topic,
                });
              } else {
                logger.warn('❓ Unknown event type received', {
                  eventType,
                  topic,
                });
              }
          }
        } catch (error: any) {
          logger.error('❌ Error processing event in OrderConsumer', {
            eventType: message?.event,
            topic: message?.topic,
            error: error.message,
            stack: error.stack,
          });
          throw error; // Let Kafka retry mechanism handle it
        }
      }
    );

    logger.info('✅ Order Consumer started successfully', {
      topics: [TOPICS.ORDERS, TOPICS.PAYMENTS],
      groupId: 'order-service-group',
    });
  }

  /**
   * Validates that events are coming from the correct topic
   */
  private validateEventTopic(eventType: string, topic?: string): void {
    if (!topic) return;

    if (eventType.startsWith('order.') && topic !== TOPICS.ORDERS) {
      logger.warn('🚨 CRITICAL: Order event received on wrong topic!', {
        eventType,
        receivedTopic: topic,
        expectedTopic: TOPICS.ORDERS,
      });
    }

    if (eventType.startsWith('payment.') && topic !== TOPICS.PAYMENTS) {
      logger.warn('🚨 CRITICAL: Payment event received on wrong topic!', {
        eventType,
        receivedTopic: topic,
        expectedTopic: TOPICS.PAYMENTS,
      });
    }
  }

  /**
   * Helper to know if we recognize this event
   */
  private isKnownEvent(eventType: string): boolean {
    return (
      eventType.startsWith('order.') ||
      eventType.startsWith('payment.') ||
      eventType.startsWith('user.') ||
      eventType.startsWith('product.')
    );
  }
}