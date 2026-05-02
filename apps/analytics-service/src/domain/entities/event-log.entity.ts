// apps/analytics-service/src/domain/entities/event-log.entity.ts

export class EventLogEntity {
  constructor(
    public readonly id: string = '',
    public readonly eventType: string,
    public readonly sourceService: string,
    public readonly payload: Record<string, any>,
    public processed: boolean = false,
    public processedAt?: Date,
    public readonly timestamp: Date = new Date()
  ) {}

  markAsProcessed(): void {
    this.processed = true;
    this.processedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      eventType: this.eventType,
      sourceService: this.sourceService,
      payload: this.payload,
      processed: this.processed,
      processedAt: this.processedAt,
      timestamp: this.timestamp,
    };
  }
}