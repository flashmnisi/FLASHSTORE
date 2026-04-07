import logger from '@org/shared-logger';
import { publish } from '@org/shared-kafka';
import { CreateOrderDto } from '../dtos/order.dto';
import { Order } from '../models/order.model';

export class OrderService {
  async createOrder(userId: string, dto: CreateOrderDto) {
    try {
      const order = await Order.create({
        user: userId,
        orderItems: dto.orderItems,
        shippingAddress: dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
        itemsPrice: dto.itemsPrice,
        shippingPrice: dto.shippingPrice,
        totalPrice: dto.totalPrice,
        deliveryOption: dto.deliveryOption,
        paymentData: dto.paymentData,
        isPaid: dto.paymentMethod === 'card',
        paidAt: dto.paymentMethod === 'card' ? new Date() : undefined,
        paymentStatus: dto.paymentMethod === 'card' ? 'Paid' : 'Pending',
      });

      // Publish Kafka event
      await publish({
        topic: 'flashstore.orders',
        message: {
          event: 'order.created',
          data: {
            orderId: order._id,
            userId,
            totalPrice: order.totalPrice,
            itemsCount: dto.orderItems.length,
            paymentMethod: dto.paymentMethod,
          },
          source: 'order-service',
        },
        key: String(order._id),
      });

      logger.info(
        { orderId: order._id, userId },
        'Order created successfully'
      );

      return order;
    } catch (error: any) {
      logger.error(
        { error: error.message, userId },
        'Failed to create order'
      );
      throw error;
    }
  }

  async getUserOrders(userId: string) {
    const orders = await Order.find({ user: userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    return orders;
  }

  async clearUserOrders(userId: string) {
    await Order.deleteMany({ user: userId });
    return true;
  }
}

export const orderService = new OrderService();