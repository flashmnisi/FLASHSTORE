import { OrderEntity } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../interfaces/order.repository';
import { OrderProducer } from '../../infrastructure/kafka/producer';
import { sendToOutbox } from '../../infrastructure/outbox/outbox.processor';
import { idempotencyService } from '@org/shared-kafka';
import logger from '../../utils/logger';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { TOPICS, EVENTS } from '@org/shared-kafka';

export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly producer: OrderProducer
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
    const log = logger.withContext({
      correlationId: context?.correlationId,
      service: 'order-service',
    });

    try {
      log.info('Creating order', { userId: dto.userId });

      // =============================
      // 1. Idempotency (Prevent duplicate orders)
      // =============================
      const existing = await this.repository.findById(dto.idempotencyKey);

      if (existing) {
        log.warn('Duplicate order prevented', {
          orderId: existing.id,
        });
        return existing;
      }

      // =============================
      // 2. Create Order Entity
      // =============================
      const order = new OrderEntity(
        '',
        dto.userId,
        dto.items,
        dto.totalAmount,
        'pending', // initial state
        'pending', // payment status
        new Date()
      );

      const savedOrder = await this.repository.create(order);

      // =============================
      // 3. Emit ORDER_CREATED (via Outbox)
      // =============================
      await sendToOutbox({
        topic: TOPICS.ORDERS,
        event: EVENTS.ORDER_CREATED,
        key: savedOrder.id,
        payload: {
          orderId: savedOrder.id,
          userId: savedOrder.userId,
          items: savedOrder.items,
          amount: savedOrder.totalAmount,
        },
      });

      log.info('Order created successfully', {
        orderId: savedOrder.id,
      });

      return savedOrder;

    } catch (error: any) {
      log.error('Create order failed', {
        error: error.message,
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
    const log = logger.withContext({
      service: 'order-service',
      event: 'payment.completed',
    });

    try {
      const { orderId, paymentId } = event.data;

      // =============================
      // 1. Idempotency (CRITICAL)
      // =============================
      const isDuplicate = await idempotencyService.isDuplicate(
        `payment.completed:${paymentId}`,
        'order-service'
      );

      if (isDuplicate) {
        log.warn('Duplicate payment event ignored', { paymentId });
        return;
      }

      // =============================
      // 2. Find Order
      // =============================
      const order = await this.repository.findById(orderId);

      if (!order) {
        log.error('Order not found for payment', { orderId });
        return;
      }

      // =============================
      // 3. Update Order State
      // =============================
      order.status = 'confirmed';
      order.paymentStatus = 'paid';

      await this.repository.update(order);

      // =============================
      // 4. Emit ORDER_CONFIRMED
      // =============================
      await sendToOutbox({
        topic: TOPICS.ORDERS,
        event: EVENTS.ORDER_STATUS_UPDATED,
        key: order.id,
        payload: {
          orderId: order.id,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      });

      log.info('Order confirmed after payment', {
        orderId: order.id,
      });

    } catch (error: any) {
      log.error('handlePaymentCompleted failed', {
        error: error.message,
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
    const log = logger.withContext({
      service: 'order-service',
      event: 'payment.failed',
    });

    try {
      const { orderId, paymentId } = event.data;

      // =============================
      // 1. Idempotency
      // =============================
      const isDuplicate = await idempotencyService.isDuplicate(
        `payment.failed:${paymentId}`,
        'order-service'
      );

      if (isDuplicate) {
        log.warn('Duplicate failure event ignored', { paymentId });
        return;
      }

      // =============================
      // 2. Find Order
      // =============================
      const order = await this.repository.findById(orderId);

      if (!order) {
        log.error('Order not found', { orderId });
        return;
      }

      // =============================
      // 3. Update Status
      // =============================
      order.status = 'cancelled';
      order.paymentStatus = 'failed';

      await this.repository.update(order);

      // =============================
      // 4. Emit ORDER_CANCELLED
      // =============================
      await sendToOutbox({
        topic: TOPICS.ORDERS,
        event: EVENTS.ORDER_STATUS_UPDATED,
        key: order.id,
        payload: {
          orderId: order.id,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      });

      log.warn('Order cancelled due to payment failure', {
        orderId: order.id,
      });

    } catch (error: any) {
      log.error('handlePaymentFailed failed', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * =============================
   * 📦 GET ORDER
   * =============================
   */
  async getOrderById(orderId: string) {
    const order = await this.repository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * =============================
   * 📜 GET USER ORDERS
   * =============================
   */
  async getOrdersByUser(userId: string) {
    return this.repository.findByUserId(userId);
  }
}