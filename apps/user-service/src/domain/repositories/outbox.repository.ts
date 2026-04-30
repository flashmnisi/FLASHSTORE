// apps/user-service/src/domain/repositories/outbox.repository.ts

export interface IOutboxRepository {
  /**
   * Create a new outbox entry
   */
  create(outboxData: {
    topic: string;
  event: string;
  payload: any;
  key?: string;
  status: 'pending' | 'processed' | 'failed';
  retries: number;
  }): Promise<any>;

  /**
   * Find pending events ready for processing
   */
  findPending(limit?: number): Promise<any[]>;

  /**
   * Mark event as successfully processed
   */
  markAsProcessed(id: string): Promise<void>;

  /**
   * Mark event as failed and update retry count
   */
  markAsFailed(id: string, errorMessage: string, retries: number): Promise<void>;

  /**
   * Lock event for processing (to prevent duplicate processing)
   */
  lockForProcessing(id: string): Promise<any | null>;
}