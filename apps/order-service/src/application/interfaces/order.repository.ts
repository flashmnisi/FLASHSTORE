import { OrderEntity } from '../../domain/entities/order.entity';

export interface IOrderRepository {
  /**
   * Create new order
   */
  create(order: OrderEntity): Promise<OrderEntity>;

  /**
   * Update order (status changes, payment updates, etc.)
   */
  update(order: OrderEntity): Promise<OrderEntity>;

  /**
   * Find by order ID
   */
  findById(orderId: string): Promise<OrderEntity | null>;

  /**
   * Find orders for a user
   */
  findByUserId(userId: string): Promise<OrderEntity[]>;

  //   findByIdempotencyKey(
  //   key: string
  // ): Promise<OrderEntity | null>;
}