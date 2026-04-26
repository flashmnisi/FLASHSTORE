import { OrderEntity, OrderItem } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../interfaces/order.repository';
//import { OrderProducer } from '../../infrastructure/kafka/producer';
import { sendToOutbox } from '../../infrastructure/outbox/outbox.processor';
import { idempotencyService } from '@org/shared-kafka';
import { CreateOrderDto } from '../dtos/create-order.dto';
import logger from '@org/shared-logger';

// Import domain events
import {
  createOrderCreatedEvent,
  createOrderStatusUpdatedEvent,
} from '../../domain/events/order.events';
//import { OrderProducer } from '../../infrastructure/kafka/producer';

export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
   // private readonly producer: OrderProducer
    //private readonly producer: OrderProducer
  ) {}

  /**
   * =============================
   * 🟢 CREATE ORDER (Saga Start)
   * =============================
   */
  async createOrder(dto: CreateOrderDto, context?: { correlationId?: string }) {
    try {
      logger.info('Creating new order', { 
        userId: dto.userId, 
        itemsCount: dto.items.length,
        correlationId: context?.correlationId 
      });

      // 1. Idempotency Check
      const existing = await this.repository.findById(dto.idempotencyKey);
      if (existing) {
        logger.warn('Duplicate order prevented (idempotency)', { 
          orderId: existing.id,
          idempotencyKey: dto.idempotencyKey 
        });
        return existing;
      }

      // 2. Create Order Entity
      const order = new OrderEntity(
        '', 
        dto.userId,
        dto.items as OrderItem[],
        dto.totalAmount,
        'pending',
        'pending'
      );

      const savedOrder = await this.repository.create(order);


      // 3. Create Domain Event
      const orderCreatedEvent = createOrderCreatedEvent({
        orderId: savedOrder.id,
        userId: savedOrder.userId,
        items: savedOrder.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: savedOrder.totalAmount,
        currency: 'USD', // you can make this configurable
      });

      // 4. Send to Outbox
      await sendToOutbox({
        topic: 'flashstore.orders',
        event: orderCreatedEvent.event,
        payload: orderCreatedEvent,
        key: savedOrder.id,
        correlationId: context?.correlationId,
      });

      logger.info('Order created successfully', {
        orderId: savedOrder.id,
        userId: savedOrder.userId,
      });

      return savedOrder;

    } catch (error: any) {
      logger.error('Failed to create order', {
        error: error.message,
        userId: dto.userId,
      });
      throw error;
    }
  }

  /**
   * =============================
   * 💳 HANDLE PAYMENT SUCCESS
   * =============================
   */
  async handlePaymentCompleted(event: any) {
    try {
      const { orderId, paymentId } = event.data;

      const isDuplicate = await idempotencyService.isDuplicate(
        `payment.completed:${paymentId}`,
        'order-service'
      );

      if (isDuplicate) {
        logger.warn('Duplicate payment.completed event ignored', { paymentId });
        return;
      }

      const order = await this.repository.findById(orderId);
      if (!order) {
        logger.error('Order not found for payment completion', { orderId });
        return;
      }

      const previousStatus = order.status;
      order.confirmOrder();

      await this.repository.update(order);

      // Create Domain Event
      const statusUpdatedEvent = createOrderStatusUpdatedEvent({
        orderId: order.id,
        userId: order.userId,
        previousStatus,
        newStatus: order.status,
      });

      await sendToOutbox({
        topic: 'flashstore.orders',
        event: statusUpdatedEvent.event,
        payload: statusUpdatedEvent,
        key: order.id,
      });

      logger.info('Order confirmed after successful payment', {
        orderId: order.id,
        paymentId,
      });

    } catch (error: any) {
      logger.error('handlePaymentCompleted failed', {
        error: error.message,
        orderId: event.data?.orderId,
      });
      throw error;
    }
  }

  /**
   * =============================
   * ❌ HANDLE PAYMENT FAILURE
   * =============================
   */
  async handlePaymentFailed(event: any) {
    try {
      const { orderId, paymentId } = event.data;

      const isDuplicate = await idempotencyService.isDuplicate(
        `payment.failed:${paymentId}`,
        'order-service'
      );

      if (isDuplicate) {
        logger.warn('Duplicate payment.failed event ignored', { paymentId });
        return;
      }

      const order = await this.repository.findById(orderId);
      if (!order) {
        logger.error('Order not found for payment failure', { orderId });
        return;
      }

      const previousStatus = order.status;
      order.cancelOrder();

      await this.repository.update(order);

      const statusUpdatedEvent = createOrderStatusUpdatedEvent({
        orderId: order.id,
        userId: order.userId,
        previousStatus,
        newStatus: order.status,
      });

      await sendToOutbox({
        topic: 'flashstore.orders',
        event: statusUpdatedEvent.event,
        payload: statusUpdatedEvent,
        key: order.id,
      });

      logger.warn('Order cancelled due to payment failure', {
        orderId: order.id,
        paymentId,
      });

    } catch (error: any) {
      logger.error('handlePaymentFailed failed', {
        error: error.message,
        orderId: event.data?.orderId,
      });
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getOrdersByUser(userId: string) {
    return this.repository.findByUserId(userId);
  }
}