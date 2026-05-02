// apps/analytics-service/src/infrastructure/persistence/mongoose/repositories/event-log.repository.impl.ts

import { EventLogEntity } from '../../../../domain/entities/event-log.entity';
import { IEventLogRepository } from '../../../../domain/repositories/event-log.repository';
import { EventLogModel } from '../models/event-log.model';
import logger from '@org/shared-logger';

export class EventLogRepositoryImpl implements IEventLogRepository {
  async save(event: EventLogEntity): Promise<EventLogEntity> {
    try {
      const doc = await EventLogModel.create({
        eventType: event.eventType,
        sourceService: event.sourceService,
        payload: event.payload,
        processed: event.processed,
        processedAt: event.processedAt,
        timestamp: event.timestamp,
      });

      return new EventLogEntity(
        doc._id.toString(),
        doc.eventType,
        doc.sourceService,
        doc.payload,
        doc.processed,
        doc.processedAt,
        doc.timestamp
      );
    } catch (error: any) {
      logger.error('Failed to save event log', { error: error.message });
      throw error;
    }
  }

  async findUnprocessed(limit = 50): Promise<EventLogEntity[]> {
    const docs = await EventLogModel.find({ processed: false })
      .sort({ timestamp: 1 })
      .limit(limit);

    return docs.map(this.mapToEntity);
  }

  async markAsProcessed(id: string): Promise<boolean> {
    const result = await EventLogModel.updateOne(
      { _id: id },
      { 
        processed: true, 
        processedAt: new Date() 
      }
    );
    return result.modifiedCount > 0;
  }

  async findById(id: string): Promise<EventLogEntity | null> {
    const doc = await EventLogModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findBySourceService(serviceName: string, limit = 50): Promise<EventLogEntity[]> {
    const docs = await EventLogModel.find({ sourceService: serviceName })
      .sort({ timestamp: -1 })
      .limit(limit);

    return docs.map(this.mapToEntity);
  }

  async cleanupOldEvents(daysOld: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await EventLogModel.deleteMany({
      processed: true,
      timestamp: { $lt: cutoffDate }
    });

    logger.info(`Cleaned up ${result.deletedCount} old events`);
    return result.deletedCount;
  }

  private mapToEntity(doc: any): EventLogEntity {
    return new EventLogEntity(
      doc._id.toString(),
      doc.eventType,
      doc.sourceService,
      doc.payload,
      doc.processed,
      doc.processedAt,
      doc.timestamp
    );
  }
}