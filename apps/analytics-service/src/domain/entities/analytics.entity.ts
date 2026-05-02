// apps/analytics-service/src/domain/entities/analytics.entity.ts

export class AnalyticsEntity {
  constructor(
    public readonly id: string = '',
    public readonly eventType: string,
    public readonly userId?: string,
    public readonly productId?: string,
    public readonly orderId?: string,
    public readonly metadata: Record<string, any> = {},
    public readonly timestamp: Date = new Date()
  ) {}

  toJSON() {
    return {
      id: this.id,
      eventType: this.eventType,
      userId: this.userId,
      productId: this.productId,
      orderId: this.orderId,
      metadata: this.metadata,
      timestamp: this.timestamp,
    };
  }
}