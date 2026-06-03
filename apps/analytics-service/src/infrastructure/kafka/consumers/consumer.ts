import {
  createConsumer,
  runConsumer,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

export class AnalyticsConsumer {
  constructor(
    private readonly trackUserRegistration: any,
    private readonly trackOrderCreated: any,
    private readonly trackPaymentSuccess: any,
    private readonly trackProductView: any,
    private readonly trackProductEvent: any,
    private readonly trackCategoryEvent: any,
    private readonly trackCartEvent?: any,
    private readonly trackInventoryEvent?: any
  ) {}

  async start() {
    const topics = [
      TOPICS.USERS,
      TOPICS.AUTH,
      TOPICS.ORDERS,
      TOPICS.PAYMENTS,
      TOPICS.PRODUCTS,
      TOPICS.CATEGORIES,
      TOPICS.CARTS,
      TOPICS.INVENTORY,
      TOPICS.NOTIFICATIONS,
    ];

    const consumer = createConsumer({
      groupId: 'analytics-service',
      topics,
      serviceName: 'analytics-service',
    });

    await runConsumer(
      consumer,
      {
        groupId: 'analytics-service',
        topics,
        serviceName: 'analytics-service',
      },
      async (message: any) => {
        try {
          const parsedMessage =
            typeof message === 'string'
              ? JSON.parse(message)
              : message;

          const eventType =
            parsedMessage?.event ||
            parsedMessage?.type;

          const data =
            parsedMessage?.data ||
            parsedMessage?.payload ||
            {};

          const metadata =
            parsedMessage?.metadata || {};

          logger.info('📥 Analytics received event', {
            eventType,
            source: metadata?.source,
          });

          switch (eventType) {

            /**
             * =====================================
             * 👤 USER EVENTS
             * =====================================
             */

            case EVENTS.USER_REGISTERED:
              await this.trackUserRegistration.execute({
                userId: data.userId,
                email: data.email,
                name: data.name,
                createdAt: data.createdAt,
              });

              logger.info('📊 User registration tracked', {
                userId: data.userId,
              });

              break;

            case EVENTS.USER_LOGGED_IN:
              logger.info('🔐 User login tracked', {
                userId: data.userId,
              });
              break;

            case EVENTS.USER_UPDATED:
            case EVENTS.USER_DELETED:
              logger.info('👤 User lifecycle tracked', {
                eventType,
                userId: data.userId,
              });
              break;

            /**
             * =====================================
             * 📦 ORDER EVENTS
             * =====================================
             */

            case EVENTS.ORDER_CREATED:
              await this.trackOrderCreated.execute({
                orderId: data.orderId,
                userId: data.userId,
                totalAmount: data.totalAmount,
                itemCount: data.items?.length || 0,
                currency: data.currency,
                createdAt: data.createdAt,
              });

              logger.info('📦 Order created tracked', {
                orderId: data.orderId,
              });

              break;

            case EVENTS.ORDER_UPDATED:
            case EVENTS.ORDER_COMPLETED:
            case EVENTS.ORDER_CANCELLED:
            case EVENTS.ORDER_STATUS_UPDATED:
              logger.info('📦 Order event tracked', {
                eventType,
                orderId: data.orderId,
              });
              break;

            /**
             * =====================================
             * 💳 PAYMENT EVENTS
             * =====================================
             */

            case EVENTS.PAYMENT_COMPLETED:
            case EVENTS.PAYMENT_SUCCEEDED:
              await this.trackPaymentSuccess.execute({
                paymentId: data.paymentId,
                orderId: data.orderId,
                userId: data.userId,
                amount: data.amount,
                currency: data.currency,
              });

              logger.info('💳 Payment success tracked', {
                orderId: data.orderId,
                paymentId: data.paymentId,
              });

              break;

            case EVENTS.PAYMENT_FAILED:
            case EVENTS.PAYMENT_REFUNDED:
            case EVENTS.PAYMENT_INITIATED:
              logger.info('💰 Payment lifecycle tracked', {
                eventType,
                paymentId: data.paymentId,
                orderId: data.orderId,
              });
              break;

            /**
             * =====================================
             * 📱 PRODUCT EVENTS
             * =====================================
             */

            case EVENTS.PRODUCT_CREATED:
            case EVENTS.PRODUCT_UPDATED:
            case EVENTS.PRODUCT_DELETED:

              await this.trackProductEvent.execute({
                eventType,
                productId: data.productId || data.id,
                name: data.name,
                categoryId: data.categoryId,
                brand: data.brand,
                price: data.price,
                currency: data.currency,
                stockQuantity: data.stockQuantity,
                inStock: data.inStock,
              });

              logger.info('📱 Product event tracked', {
                eventType,
                productId: data.productId,
              });

              break;

            case EVENTS.PRODUCT_VIEWED:
              await this.trackProductView.execute({
                userId: data.userId,
                productId: data.productId,
                viewedAt: data.viewedAt,
              });

              logger.info('👀 Product view tracked', {
                productId: data.productId,
              });

              break;

            /**
             * =====================================
             * 📂 CATEGORY EVENTS
             * =====================================
             */

            case EVENTS.CATEGORY_CREATED:
            case EVENTS.CATEGORY_UPDATED:
            case EVENTS.CATEGORY_DELETED:

              await this.trackCategoryEvent.execute({
                eventType,
                categoryId: data.categoryId || data.id,
                name: data.name,
                slug: data.slug,
                parentId: data.parentId,
              });

              logger.info('📂 Category event tracked', {
                eventType,
                categoryId: data.categoryId,
              });

              break;

            /**
             * =====================================
             * 🛒 CART EVENTS
             * =====================================
             */

            case EVENTS.CART_UPDATED:
            case EVENTS.CART_CHECKED_OUT:
            case EVENTS.CART_CLEARED:

              await this.trackCartEvent?.execute({
                eventType,
                userId: data.userId,
                cartId: data.cartId,
                orderId: data.orderId,
                totalAmount: data.totalAmount,
                items: data.items || [],
              });

              logger.info('🛒 Cart event tracked', {
                eventType,
                userId: data.userId,
              });

              break;

            /**
             * =====================================
             * 📦 INVENTORY EVENTS
             * =====================================
             */

            case EVENTS.STOCK_UPDATED:

              await this.trackInventoryEvent?.execute({
                productId: data.productId,
                stockQuantity:
                  data.stockQuantity || data.quantity,
                inStock: data.inStock,
              });

              logger.info('📦 Inventory tracked', {
                productId: data.productId,
              });

              break;

            /**
             * =====================================
             * 📧 NOTIFICATION EVENTS
             * =====================================
             */

            case EVENTS.NOTIFICATION_SENT:
            case EVENTS.NOTIFICATION_FAILED:

              logger.info('📧 Notification analytics tracked', {
                eventType,
                notificationId: data.notificationId,
                userId: data.userId,
              });

              break;

            /**
             * =====================================
             * ⚠️ UNKNOWN EVENTS
             * =====================================
             */

            default:
              logger.warn('⚠️ Unknown analytics event received', {
                eventType,
              });
          }

        } catch (error: any) {
          logger.error('❌ Failed to process analytics event', {
            error: error.message,
            stack: error.stack,
            eventType: message?.event,
          });

          // DO NOT THROW
          // analytics should not crash entire consumer pipeline
        }
      }
    );

    logger.info(
      '🚀 Analytics Consumer running successfully'
    );
  }
}