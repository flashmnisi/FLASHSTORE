// apps/analytics-service/src/domain/repositories/event-log.repository.ts

import { EventLogEntity } from '../entities/event-log.entity';

export interface IEventLogRepository {
  /**
   * Save incoming event to log (before processing)
   */
  save(event: EventLogEntity): Promise<EventLogEntity>;

  /**
   * Find unprocessed events (for retry/outbox style)
   */
  findUnprocessed(limit?: number): Promise<EventLogEntity[]>;

  /**
   * Mark event as processed
   */
  markAsProcessed(id: string): Promise<boolean>;

  /**
   * Find event by ID
   */
  findById(id: string): Promise<EventLogEntity | null>;

  /**
   * Find events by source service
   */
  findBySourceService(serviceName: string, limit?: number): Promise<EventLogEntity[]>;

  /**
   * Clean old processed events (maintenance)
   */
  cleanupOldEvents(daysOld: number): Promise<number>;
}