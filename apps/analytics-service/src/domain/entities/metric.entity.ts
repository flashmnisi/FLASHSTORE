// apps/analytics-service/src/domain/entities/metric.entity.ts

export class MetricEntity {
  public readonly id: string;
  public readonly metricType: string;
  public readonly value: number;
  public readonly date: Date;
  public readonly dimensions: Record<string, any>;
  public readonly metadata?: Record<string, any>;
  public readonly updatedAt: Date;

  constructor(
    id: '',
    metricType: string,
    value: number,
    date: Date | string,
    dimensions: Record<string, any> = {},
    metadata: Record<string, any> = {},
    updatedAt?: Date
  ) {
    this.id = id || `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.metricType = metricType;
    this.value = value;
    this.date = typeof date === 'string' ? new Date(date) : date;
    this.dimensions = dimensions;
    this.metadata = metadata;
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Create daily sales metric
   */
  static createDailySales(
    totalRevenue: number,
    orderCount: number,
    date: Date = new Date()
  ): MetricEntity {
    return new MetricEntity(
      '',
      'daily_sales',
      totalRevenue,
      date,
      { type: 'revenue' },
      { orderCount }
    );
  }

  /**
   * Create user signups metric
   */
  static createUserSignups(count: number, date: Date = new Date()): MetricEntity {
    return new MetricEntity(
      '',
      'daily_signups',
      count,
      date,
      { type: 'users' }
    );
  }

  toJSON() {
    return {
      id: this.id,
      metricType: this.metricType,
      value: this.value,
      date: this.date.toISOString(),
      dimensions: this.dimensions,
      metadata: this.metadata,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}