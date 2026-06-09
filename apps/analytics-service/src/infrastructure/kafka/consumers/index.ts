// apps/analytics-service/src/infrastructure/kafka/consumer.ts

import {
  subscribe,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { UserHandler } from './handlers/user.handler';
import { OrderHandler } from './handlers/order.handler';
import { PaymentHandler } from './handlers/payment.handler';
import { ProductHandler } from './handlers/product.handler';
import { CategoryHandler } from './handlers/category.handler';
import { CartHandler } from './handlers/cart.handler';
import { InventoryHandler } from './handlers/inventory.handler';
import { NotificationHandler } from './handlers/notification.handler';

export class AnalyticsConsumer {
  constructor(
    private readonly userHandler: UserHandler,
    private readonly orderHandler: OrderHandler,
    private readonly paymentHandler: PaymentHandler,
    private readonly productHandler: ProductHandler,
    private readonly categoryHandler: CategoryHandler,
    private readonly cartHandler: CartHandler,
    private readonly inventoryHandler: InventoryHandler,
    private readonly notificationHandler: NotificationHandler
  ) {}

  async start() {
    try {
      await subscribe(
        {
          topics: [
            TOPICS.USERS,
            TOPICS.AUTH,
            TOPICS.ORDERS,
            TOPICS.PAYMENTS,
            TOPICS.PRODUCTS,
            TOPICS.CATEGORIES,
            TOPICS.CARTS,
            TOPICS.INVENTORY,
            TOPICS.NOTIFICATIONS,
          ],
          groupId: 'analytics-service-group',
          serviceName: 'analytics-service',
        },

        async (message: any) => {
          try {
            const eventType =
              message.event ||
              message.type;

            const data =
              message.data?.data ??
              message.data ??
              message.payload?.data ??
              message.payload ??
              {};

            logger.info(
              '📥 Analytics received event',
              {
                eventType,
                topic: message.topic,
              }
            );

            switch (eventType) {
              /**
               * =========================
               * USERS
               * =========================
               */
              case EVENTS.USER_REGISTERED:
              case EVENTS.USER_LOGGED_IN:
              case EVENTS.USER_UPDATED:
              case EVENTS.USER_DELETED:
                await this.userHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * ORDERS
               * =========================
               */
              case EVENTS.ORDER_CREATED:
              case EVENTS.ORDER_UPDATED:
              case EVENTS.ORDER_COMPLETED:
              case EVENTS.ORDER_CANCELLED:
              case EVENTS.ORDER_STATUS_UPDATED:
                await this.orderHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * PAYMENTS
               * =========================
               */
              case EVENTS.PAYMENT_COMPLETED:
              case EVENTS.PAYMENT_FAILED:
              case EVENTS.PAYMENT_REFUNDED:
              case EVENTS.PAYMENT_INITIATED:
                await this.paymentHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * PRODUCTS
               * =========================
               */
              case EVENTS.PRODUCT_CREATED:
              case EVENTS.PRODUCT_UPDATED:
              case EVENTS.PRODUCT_DELETED:
              case EVENTS.PRODUCT_VIEWED:
                await this.productHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * CATEGORIES
               * =========================
               */
              case EVENTS.CATEGORY_CREATED:
              case EVENTS.CATEGORY_UPDATED:
              case EVENTS.CATEGORY_DELETED:
                await this.categoryHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * CARTS
               * =========================
               */
              case EVENTS.CART_UPDATED:
              case EVENTS.CART_CLEARED:
              case EVENTS.CART_CHECKED_OUT:
                await this.cartHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * INVENTORY
               * =========================
               */
              case EVENTS.STOCK_ADJUSTED:
              case EVENTS.STOCK_DEDUCTED:
              case EVENTS.STOCK_RESERVED:
              case EVENTS.STOCK_RELEASED:
                await this.inventoryHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              /**
               * =========================
               * NOTIFICATIONS
               * =========================
               */
              case EVENTS.NOTIFICATION_SENT:
              case EVENTS.NOTIFICATION_FAILED:
                await this.notificationHandler.handle({
                  event: eventType,
                  data,
                });
                break;

              default:
                logger.warn(
                  '⚠️ Unknown event received',
                  {
                    eventType,
                  }
                );
            }
          } catch (error: any) {
            logger.error(
              '❌ Error processing analytics event',
              {
                eventType: message?.event,
                error: error.message,
                stack: error.stack,
              }
            );

            // Never throw
            // Analytics should not break the pipeline
          }
        }
      );

      logger.info(
        '🚀 Analytics Consumer started successfully with all handlers'
      );
    } catch (error: any) {
      logger.error(
        '❌ Failed to start Analytics Consumer',
        {
          error: error.message,
        }
      );

      throw error;
    }
  }
}