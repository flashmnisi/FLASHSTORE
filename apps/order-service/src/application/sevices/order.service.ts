// apps/order-service/src/application/services/order.service.ts

import { OrderEntity, OrderItem } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../interfaces/order.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { EVENTS, idempotencyService, TOPICS } from '@org/shared-kafka';
import { CreateOrderDto } from '../dtos/create-order.dto';
import logger from '@org/shared-logger';
import {
  createOrderCreatedEvent,
  createOrderStatusUpdatedEvent,
} from '../../domain/events/order.events';
import {
  ordersCreatedTotal,
  ordersCompletedTotal,
  ordersCancelledTotal,
} from '@org/shared-metrics';

export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly outboxService: OutboxService
  ) {}

  async createOrder(dto: CreateOrderDto, context?: { correlationId?: string }) {
    try {
      logger.info('Creating new order', {
        userId: dto.userId,
        itemsCount: dto.items.length,
        correlationId: context?.correlationId,
      });

      const isDuplicate = await idempotencyService.isDuplicate(
        `order:create:${dto.idempotencyKey}`,
        'order-service'
      );

      if (isDuplicate) {
        throw new Error('Duplicate order request');
      }

      const order = new OrderEntity(
        '',
        dto.userId,
        dto.items as OrderItem[],
        0,
        dto.idempotencyKey,
        dto.currency || 'ZAR',
        'pending',
        'pending'
      );

      const itemsTotal = order.calculateTotal();
      const shippingPrice = dto.shippingPrice || 0;
      order.totalAmount = itemsTotal + shippingPrice;

      const savedOrder = await this.repository.create(order);

      // Business metric — after successful DB create
      ordersCreatedTotal.inc({
        service: 'order-service',
        status: savedOrder.status || 'pending',
      });

      const orderCreatedEvent = createOrderCreatedEvent({
        orderId: savedOrder.id,
        userId: savedOrder.userId,
        userEmail: dto.userEmail,
        customerName: dto.customerName || dto.shippingAddress?.name,
        items: savedOrder.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        itemsTotal,
        shippingPrice,
        totalAmount: savedOrder.totalAmount,
        currency: savedOrder.currency || 'ZAR',
        shippingAddress: dto.shippingAddress,
      });

      await this.outboxService.write({
        topic: TOPICS.ORDERS,
        event: EVENTS.ORDER_CREATED,
        data: orderCreatedEvent,
        key: savedOrder.id,
        correlationId: context?.correlationId,
      });

      logger.info('Order created successfully', {
        orderId: savedOrder.id,
        totalAmount: savedOrder.totalAmount,
        itemsTotal,
        shippingPrice,
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

      // Business metric — order completed
      ordersCompletedTotal.inc({
        service: 'order-service',
      });

      const statusUpdatedEvent = createOrderStatusUpdatedEvent({
        orderId: order.id,
        userId: order.userId,
        previousStatus,
        newStatus: order.status,
      });

      await this.outboxService.write({
        topic: TOPICS.ORDERS,
        event: statusUpdatedEvent.event,
        data: statusUpdatedEvent,
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

      // Business metric — order cancelled
      ordersCancelledTotal.inc({
        service: 'order-service',
        reason: 'payment_failed',
      });

      const statusUpdatedEvent = createOrderStatusUpdatedEvent({
        orderId: order.id,
        userId: order.userId,
        previousStatus,
        newStatus: order.status,
      });

      await this.outboxService.write({
        topic: TOPICS.ORDERS,
        event: statusUpdatedEvent.event,
        data: statusUpdatedEvent,
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
