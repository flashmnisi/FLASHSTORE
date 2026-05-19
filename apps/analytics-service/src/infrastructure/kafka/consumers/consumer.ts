import { createConsumer, runConsumer, TOPICS, EVENTS } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export class AnalyticsConsumer {
  constructor(
    private readonly trackUserRegistration: any,
    private readonly trackOrderCreated: any,
    private readonly trackPaymentSuccess: any,
    private readonly trackProductView: any
  ) {}

  async start() {
    const consumer = createConsumer({
      groupId: 'analytics-service',
      topics: [
        TOPICS.USERS,
        TOPICS.AUTH,
        TOPICS.ORDERS,
        TOPICS.PAYMENTS,
        TOPICS.PRODUCTS,
      ],
      serviceName: 'analytics-service',
    });

    await runConsumer(
      consumer,
      {
        groupId: 'analytics-service',
        topics: [
          TOPICS.USERS,
          TOPICS.AUTH,
          TOPICS.ORDERS,
          TOPICS.PAYMENTS,
          TOPICS.PRODUCTS,
        ],
        serviceName: 'analytics-service',
      },
      async (message: any) => {
        try {
          const event = typeof message === 'string'
            ? JSON.parse(message)
            : message;

          const eventType = event.event;
          const data = event.data;

          switch (eventType) {

            case EVENTS.USER_REGISTERED:
              await this.trackUserRegistration.execute({
                userId: data.userId,
                email: data.email,
                name: data.name,
              });
              logger.info('📊 User registered tracked');
              break;

            case EVENTS.USER_LOGGED_IN:
              logger.info('🔐 User login tracked');
              break;

            case EVENTS.ORDER_CREATED:
              await this.trackOrderCreated.execute({
                orderId: data.orderId,
                userId: data.userId,
                totalAmount: data.totalAmount,
                itemCount: data.items?.length || 0,
                createdAt: data.createdAt,
              });
              logger.info('📦 Order tracked');
              break;

            case EVENTS.PAYMENT_COMPLETED:
              await this.trackPaymentSuccess.execute(data);
              logger.info('💳 Payment tracked');
              break;

            case EVENTS.PRODUCT_VIEWED:
              await this.trackProductView.execute(data);
              logger.info('👀 Product view tracked');
              break;

            default:
              logger.warn('⚠️ Unknown event type', { eventType });
          }

        } catch (error: any) {
          logger.error('❌ Analytics consumer error', {
            error: error.message,
          });
          throw error;
        }
      }
    );

    logger.info('🚀 Analytics Consumer running (SINGLE GROUP MODE)');
  }
}