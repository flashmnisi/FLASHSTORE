import { OrderEntity, OrderItem } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../interfaces/order.repository';
import { sendToOutbox } from '../../infrastructure/outbox/outbox.processor';
import { EVENTS, idempotencyService, TOPICS } from '@org/shared-kafka';
import { CreateOrderDto } from '../dtos/create-order.dto';
import logger from '@org/shared-logger';

import {
  createOrderCreatedEvent,
  createOrderStatusUpdatedEvent,
} from '../../domain/events/order.events';

export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
  ) {}

  /**
   * =============================
   * 🟢 CREATE ORDER (Saga Start)
   * =============================
   */
  async createOrder(
    dto: CreateOrderDto,
    context?: { correlationId?: string }
  ) {
    try {
      logger.info('Creating new order', {
        userId: dto.userId,
        itemsCount: dto.items.length,
        correlationId: context?.correlationId,
      });

      /**
       * =================================
       * IDEMPOTENCY CHECK
       * =================================
       */
      const isDuplicate =
        await idempotencyService.isDuplicate(
          `order:create:${dto.idempotencyKey}`,
          'order-service'
        );

      if (isDuplicate) {
        logger.warn(
          'Duplicate order prevented',
          {
            idempotencyKey:
              dto.idempotencyKey,
          }
        );

        throw new Error(
          'Duplicate order request'
        );
      }

      /**
       * =================================
       * CREATE ORDER ENTITY
       * =================================
       */
      const order = new OrderEntity(
        '',
        dto.userId,
        dto.items as OrderItem[],
        dto.totalAmount,
        dto.idempotencyKey, 
        dto.currency, 
        'pending',
        'pending'
      );

      /**
       * =================================
       * SAVE ORDER
       * =================================
       */
      const savedOrder =
        await this.repository.create(
          order
        );

      /**
       * =================================
       * DOMAIN EVENT
       * =================================
       */
      const orderCreatedEvent =
        createOrderCreatedEvent({
          orderId: savedOrder.id,

          userId: savedOrder.userId,

          items:
            savedOrder.items.map(
              (item) => ({
                productId:
                  item.productId,

                quantity:
                  item.quantity,

                price: item.price,
              })
            ),

          totalAmount:
            savedOrder.totalAmount,

          currency: 'USD',
        });

      /**
       * =================================
       * OUTBOX EVENT
       * =================================
       */
      await sendToOutbox({
        topic: TOPICS.ORDERS,

        event:EVENTS.ORDER_CREATED,

        payload:
          orderCreatedEvent,

        key: savedOrder.id,

        correlationId:
          context?.correlationId,
      });

      logger.info(
        'Order created successfully',
        {
          orderId: savedOrder.id,
          userId: savedOrder.userId,
        }
      );

      return savedOrder;

    } catch (error: any) {
      logger.error(
        'Failed to create order',
        {
          error: error.message,
          userId: dto.userId,
        }
      );

      throw error;
    }
  }

  /**
   * =============================
   * 💳 HANDLE PAYMENT SUCCESS
   * =============================
   */
  async handlePaymentCompleted(
    event: any
  ) {
    try {
      const { orderId, paymentId } =
        event.data;

      const isDuplicate =
        await idempotencyService.isDuplicate(
          `payment.completed:${paymentId}`,
          'order-service'
        );

      if (isDuplicate) {
        logger.warn(
          'Duplicate payment.completed event ignored',
          { paymentId }
        );

        return;
      }

      const order =
        await this.repository.findById(
          orderId
        );

      if (!order) {
        logger.error(
          'Order not found for payment completion',
          { orderId }
        );

        return;
      }

      const previousStatus =
        order.status;

      order.confirmOrder();

      await this.repository.update(
        order
      );

      const statusUpdatedEvent =
        createOrderStatusUpdatedEvent(
          {
            orderId: order.id,

            userId: order.userId,

            previousStatus,

            newStatus:
              order.status,
          }
        );

      await sendToOutbox({
        topic: 'flashstore.orders',

        event:
          statusUpdatedEvent.event,

        payload:
          statusUpdatedEvent,

        key: order.id,
      });

      logger.info(
        'Order confirmed after successful payment',
        {
          orderId: order.id,
          paymentId,
        }
      );

    } catch (error: any) {
      logger.error(
        'handlePaymentCompleted failed',
        {
          error: error.message,
          orderId:
            event.data?.orderId,
        }
      );

      throw error;
    }
  }

  /**
   * =============================
   * ❌ HANDLE PAYMENT FAILURE
   * =============================
   */
  async handlePaymentFailed(
    event: any
  ) {
    try {
      const { orderId, paymentId } =
        event.data;

      const isDuplicate =
        await idempotencyService.isDuplicate(
          `payment.failed:${paymentId}`,
          'order-service'
        );

      if (isDuplicate) {
        logger.warn(
          'Duplicate payment.failed event ignored',
          { paymentId }
        );

        return;
      }

      const order =
        await this.repository.findById(
          orderId
        );

      if (!order) {
        logger.error(
          'Order not found for payment failure',
          { orderId }
        );

        return;
      }

      const previousStatus =
        order.status;

      order.cancelOrder();

      await this.repository.update(
        order
      );

      const statusUpdatedEvent =
        createOrderStatusUpdatedEvent(
          {
            orderId: order.id,

            userId: order.userId,

            previousStatus,

            newStatus:
              order.status,
          }
        );

      await sendToOutbox({
        topic: 'flashstore.orders',

        event:
          statusUpdatedEvent.event,

        payload:
          statusUpdatedEvent,

        key: order.id,
      });

      logger.warn(
        'Order cancelled due to payment failure',
        {
          orderId: order.id,
          paymentId,
        }
      );

    } catch (error: any) {
      logger.error(
        'handlePaymentFailed failed',
        {
          error: error.message,
          orderId:
            event.data?.orderId,
        }
      );

      throw error;
    }
  }

  /**
   * =============================
   * GET ORDER BY ID
   * =============================
   */
  async getOrderById(
    orderId: string
  ) {
    const order =
      await this.repository.findById(
        orderId
      );

    if (!order) {
      throw new Error(
        'Order not found'
      );
    }

    return order;
  }

  /**
   * =============================
   * GET USER ORDERS
   * =============================
   */
  async getOrdersByUser(
    userId: string
  ) {
    return this.repository.findByUserId(
      userId
    );
  }
}