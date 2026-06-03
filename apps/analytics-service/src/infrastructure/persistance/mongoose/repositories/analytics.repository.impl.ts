import { AnalyticsEntity } from '../../../../domain/entities/analytics.entity';
import { MetricEntity } from '../../../../domain/entities/metric.entity';
import { IAnalyticsRepository } from '../../../../domain/repositories/analytics.repository';
import { AnalyticsModel } from '../models/analytics.model';
import { MetricModel } from '../models/metric.model';
import logger from '@org/shared-logger';

export class AnalyticsRepositoryImpl implements IAnalyticsRepository {

  constructor(
    private readonly analyticsModel: typeof AnalyticsModel,
    private readonly metricModel: typeof MetricModel
  ) {}

  async saveEvent(event: AnalyticsEntity): Promise<AnalyticsEntity> {
    try {
      const doc = await this.analyticsModel.create(
        event.toJSON ? event.toJSON() : event
      );

      logger.debug('Analytics event saved', { 
        eventType: event.eventType, 
        id: doc._id 
      });

      return new AnalyticsEntity(
        doc._id.toString(),
        doc.eventType,
        doc.userId,
        doc.productId,
        doc.orderId,
        doc.metadata,
        doc.timestamp
      );
    } catch (error: any) {
      logger.error('Failed to save analytics event', { error: error.message });
      throw error;
    }
  }

async updateDailyStats(stats: {
  date: Date;
  totalRevenue: number;
  orderCount: number;
  itemCount?: number;
}): Promise<void> {
  try {
    const dateStr = stats.date
      .toISOString()
      .split('T')[0];

    await this.metricModel.findOneAndUpdate(
      {
        metricType: 'daily_sales',
        date: dateStr,
      },
      {
        $inc: {
          value: stats.totalRevenue || 0,
          'metadata.orderCount': stats.orderCount || 0,
          'metadata.itemCount': stats.itemCount || 0,
        },

        $setOnInsert: {
          metricType: 'daily_sales',
          date: dateStr,
          dimensions: {
            type: 'revenue',
          },
          metadata: {
            orderCount: 0,
            itemCount: 0,
          },
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    logger.debug('Daily stats updated', {
      date: dateStr,
      revenue: stats.totalRevenue,
    });

  } catch (error: any) {
    logger.error('Failed to update daily stats', {
      error: error.message,
      date: stats.date,
    });
  }
}

  async getDailyMetrics(date: Date): Promise<MetricEntity[]> {
    const metrics = await this.metricModel.find({
      date: date.toISOString().split('T')[0]
    });

    return metrics.map(m => new MetricEntity(
      m._id.toString(),
      m.metricType,
      m.value,
      m.date,
      (m as any).dimensions || {},
      (m as any).metadata || {}
    ));
  }

  async getRevenueMetrics(startDate: Date, endDate: Date): Promise<MetricEntity[]> {
    const metrics = await this.metricModel.find({
      metricType: 'daily_sales',
      date: {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    }).sort({ date: 1 });

    return metrics.map(m => new MetricEntity(
      m._id.toString(),
      m.metricType,
      m.value,
      m.date,
      (m as any).dimensions || {},
      (m as any).metadata || {}
    ));
  }

  async getTopProducts(limit = 10): Promise<MetricEntity[]> {
    // Implement based on your needs
    return [];
  }

  async getUserEngagement(userId: string): Promise<MetricEntity[]> {
    return [];
  }

  async findByUserId(userId: string, limit = 50): Promise<AnalyticsEntity[]> {
    const docs = await AnalyticsModel.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);
    return docs.map(this.mapToEntity);
  }

  async findByEventType(eventType: string, limit = 100): Promise<AnalyticsEntity[]> {
    const docs = await AnalyticsModel.find({ eventType })
      .sort({ timestamp: -1 })
      .limit(limit);
    return docs.map(this.mapToEntity);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsEntity[]> {
    const docs = await AnalyticsModel.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 });
    return docs.map(this.mapToEntity);
  }

  async countByEventType(
    eventType: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const query: any = { eventType };
    if (startDate) query.timestamp = { $gte: startDate };
    if (endDate) query.timestamp = { ...query.timestamp, $lte: endDate };

    return await AnalyticsModel.countDocuments(query);
  }

  async getDailyStats(date: Date): Promise<any> {
    return this.metricModel.findOne({
      metricType: 'daily_sales',
      date: date.toISOString().split('T')[0]
    });
  }

  private mapToEntity(doc: any): AnalyticsEntity {
    return new AnalyticsEntity(
      doc._id.toString(),
      doc.eventType,
      doc.userId,
      doc.productId,
      doc.orderId,
      doc.metadata,
      doc.timestamp
    );
  }
}