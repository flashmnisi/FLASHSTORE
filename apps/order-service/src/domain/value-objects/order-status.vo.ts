export type OrderStatusType =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed';

/**
 * Value Object: Order Status
 * Encapsulates business rules around state transitions
 */
export class OrderStatus {
  private constructor(private readonly value: OrderStatusType) {}

  static create(status: OrderStatusType): OrderStatus {
    return new OrderStatus(status);
  }

  getValue(): OrderStatusType {
    return this.value;
  }

  /**
   * Business rule: allowed transitions
   */
  canTransitionTo(next: OrderStatusType): boolean {
    const transitions: Record<OrderStatusType, OrderStatusType[]> = {
      pending: ['payment_pending', 'cancelled'],
      payment_pending: ['paid', 'failed', 'cancelled'],
      paid: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
      failed: ['payment_pending'],
    };

    return transitions[this.value].includes(next);
  }

  /**
   * Ensure safe transition
   */
  transitionTo(next: OrderStatusType): OrderStatus {
    if (!this.canTransitionTo(next)) {
      throw new Error(
        `Invalid order status transition: ${this.value} → ${next}`
      );
    }

    return new OrderStatus(next);
  }

  /**
   * Helpers
   */
  isFinal(): boolean {
    return ['delivered', 'cancelled', 'failed'].includes(this.value);
  }

  isActive(): boolean {
    return !this.isFinal();
  }
}
