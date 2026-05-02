// apps/analytics-service/src/infrastructure/persistence/mongoose/repositories/analytics.repository.impl.ts

import { AnalyticsEntity } from '../../../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../../../domain/repositories/analytics.repository';
import { AnalyticsModel } from '../models/analytics.model';
import logger from '@org/shared-logger';

export class AnalyticsRepositoryImpl implements IAnalyticsRepository {
  async saveEvent(event: AnalyticsEntity): Promise<AnalyticsEntity> {
    try {
      const doc = await AnalyticsModel.create({
        eventType: event.eventType,
        userId: event.userId,
        productId: event.productId,
        orderId: event.orderId,
        metadata: event.metadata,
        timestamp: event.timestamp,
      });

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

  async getDailyMetrics(date: Date) {
    // Aggregate daily metrics
    return await AnalyticsModel.aggregate([
      { $match: { timestamp: { $gte: date } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);
  }

  async getRevenueMetrics(startDate: Date, endDate: Date) {
    return await AnalyticsModel.aggregate([
      {
        $match: {
          eventType: 'payment.succeeded',
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$metadata.amount' },
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getTopProducts(limit = 10) {
    return await AnalyticsModel.aggregate([
      { $match: { eventType: 'product.viewed' } },
      { $group: { _id: '$productId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: limit }
    ]);
  }

  async getUserEngagement(userId: string) {
    return await AnalyticsModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);
  }

  async countByEventType(eventType: string, startDate?: Date, endDate?: Date) {
    const query: any = { eventType };
    if (startDate) query.timestamp = { $gte: startDate };
    if (endDate) query.timestamp = { ...query.timestamp, $lte: endDate };

    return await AnalyticsModel.countDocuments(query);
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