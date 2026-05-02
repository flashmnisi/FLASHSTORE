// apps/analytics-service/src/domain/entities/metric.entity.ts

export class MetricEntity {
  constructor(
    public readonly id: string = '',
    public readonly metricType: string, // e.g., 'daily_sales', 'user_signups', 'top_products'
    public readonly value: number,
    public readonly date: Date,
    public readonly dimensions: Record<string, string> = {}, // e.g., { category: 'electronics' }
    public readonly updatedAt: Date = new Date()
  ) {}

  toJSON() {
    return {
      id: this.id,
      metricType: this.metricType,
      value: this.value,
      date: this.date,
      dimensions: this.dimensions,
      updatedAt: this.updatedAt,
    };
  }
}