// apps/inventory-service/src/domain/entities/outbox.entity.ts

export type OutboxStatus =
  | 'pending'
  | 'processing'
  | 'processed'
  | 'failed';

export class OutboxEntity {
  public readonly id?: string;
  public readonly topic: string;
  public readonly event: string;
  public readonly payload: any;
  public readonly key?: string;
  public readonly correlationId?: string;

  public status: OutboxStatus;
  public retries: number;
  public errorMessage?: string;

  public createdAt: Date;
  public updatedAt: Date;
  public nextRetryAt?: Date;
  public processedAt?: Date;
  public failedAt?: Date;
  public lockedAt?: Date;

  constructor(data: {
    id?: string;
    topic: string;
    event: string;
    payload: any;
    key?: string;
    correlationId?: string;
    status?: OutboxStatus;
    retries?: number;
    errorMessage?: string;
    createdAt?: Date;
    updatedAt?: Date;
    nextRetryAt?: Date;
    processedAt?: Date;
    failedAt?: Date;
    lockedAt?: Date;
  }) {
    this.id = data.id;
    this.topic = data.topic;
    this.event = data.event;
    this.payload = data.payload;
    this.key = data.key;
    this.correlationId = data.correlationId;

    this.status = data.status || 'pending';
    this.retries = data.retries || 0;
    this.errorMessage = data.errorMessage;

    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.nextRetryAt = data.nextRetryAt;
    this.processedAt = data.processedAt;
    this.failedAt = data.failedAt;
    this.lockedAt = data.lockedAt;
  }

  markAsProcessed(): void {
    this.status = 'processed';
    this.processedAt = new Date();
    this.lockedAt = undefined;
    this.updatedAt = new Date();
  }

  markAsFailed(errorMessage: string): void {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    this.failedAt = new Date();
    this.lockedAt = undefined;
    this.updatedAt = new Date();
  }

  incrementRetry(nextRetryAt: Date): void {
    this.retries += 1;
    this.status = 'pending';
    this.nextRetryAt = nextRetryAt;
    this.lockedAt = undefined;
    this.updatedAt = new Date();
  }

  lock(): void {
    this.status = 'processing';
    this.lockedAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      topic: this.topic,
      event: this.event,
      payload: this.payload,
      key: this.key,
      correlationId: this.correlationId,
      status: this.status,
      retries: this.retries,
      errorMessage: this.errorMessage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      nextRetryAt: this.nextRetryAt,
      processedAt: this.processedAt,
      failedAt: this.failedAt,
    };
  }
}