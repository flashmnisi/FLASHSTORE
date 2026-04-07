import logger from '@org/shared-logger';
import { publish } from '@org/shared-kafka';
import { Order } from '../models/order.model';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dtos/order.dto';

export class OrderService {
  async createOrder(userId: string, dto: CreateOrderDto) {
    try {
      const totalAmount = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const order = await Order.create({
        userId,
        items: dto.items,
        totalAmount,
        shippingAddress: dto.shippingAddress,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Publish event
      await publish({
        topic: 'flashstore.orders',
        message: {
          event: 'order.created',
          data: {
            orderId: order._id,
            userId,
            totalAmount,
            itemsCount: dto.items.length,
          },
          source: 'order-service',
        },
        key: String(order._id),
      });

      logger.info({ orderId: order._id, userId }, 'Order created successfully');
      return order;
    } catch (error: any) {
      logger.error({ error: error.message, userId }, 'Failed to create order');
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await Order.findByIdAndUpdate(orderId, { status: dto.status }, { new: true });
    if (!order) throw new Error('Order not found');
    return order;
  }
}

export const orderService = new OrderService();