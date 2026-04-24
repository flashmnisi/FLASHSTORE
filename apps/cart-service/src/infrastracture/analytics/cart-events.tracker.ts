// apps/cart-service/src/infrastructure/analytics/cart-events.tracker.ts

import logger from '../../utils/logger';
import { sendToOutbox } from '../outbox/outbox.processor';

export class CartEventsTracker {

  /**
   * 🛒 Item added
   */
  async trackItemAdded(data: {
    userId: string;
    productId: string;
    quantity: number;
    price: number;
  }) {
    await sendToOutbox({
      topic: 'analytics.cart',
      event: 'cart.item_added',
      key: data.userId,
      payload: data,
    });

    logger.info('Tracked cart item added', data);
  }

  /**
   * ❌ Item removed
   */
  async trackItemRemoved(data: {
    userId: string;
    productId: string;
  }) {
    await sendToOutbox({
      topic: 'analytics.cart',
      event: 'cart.item_removed',
      key: data.userId,
      payload: data,
    });

    logger.info('Tracked cart item removed', data);
  }

  /**
   * 💰 Checkout started
   */
  async trackCheckoutStarted(data: {
    userId: string;
    cartId: string;
    totalAmount: number;
    totalItems: number;
  }) {
    await sendToOutbox({
      topic: 'analytics.cart',
      event: 'cart.checkout_started',
      key: data.userId,
      payload: data,
    });

    logger.info('Tracked checkout started', data);
  }

  /**
   * ✅ Checkout completed
   */
  async trackCheckoutCompleted(data: {
    userId: string;
    orderId: string;
    totalAmount: number;
  }) {
    await sendToOutbox({
      topic: 'analytics.cart',
      event: 'cart.checkout_completed',
      key: data.userId,
      payload: data,
    });

    logger.info('Tracked checkout completed', data);
  }
}