import { IOrderRepository } from '../../../application/interfaces/order.repository';
import { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderModel } from '../model/order.model';

export class OrderRepositoryImpl implements IOrderRepository {
  /**
   * Create Order
   */
  async create(order: OrderEntity): Promise<OrderEntity> {
    const created = await OrderModel.create(order);

    return this.toEntity(created);
  }

  /**
   * Update Order
   */
  async update(order: OrderEntity): Promise<OrderEntity> {
    const updated = await OrderModel.findByIdAndUpdate(
      order.id,
      order,
      { new: true }
    );

    if (!updated) {
      throw new Error('Order not found');
    }

    return this.toEntity(updated);
  }

  /**
   * Find by ID
   */
  async findById(
  key: string
): Promise<OrderEntity | null> {
  const order =
    await OrderModel.findOne({
      idempotencyKey: key,
    });

  return order
    ? this.toEntity(order)
    : null;
}

  /**
   * Find orders by user
   */
  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });

    return orders.map(this.toEntity);
  }

  /**
   * =============================
   * Mapper: DB → Domain
   * =============================
   */
  private toEntity(doc: any): OrderEntity {
    return new OrderEntity(
      doc._id.toString(),
      doc.userId,
      doc.items,
      doc.totalAmount,
      doc.status,
      doc.paymentStatus,
      doc.createdAt
    );
  }
}