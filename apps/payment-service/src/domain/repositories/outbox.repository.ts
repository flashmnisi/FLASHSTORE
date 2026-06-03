// apps/payment-service/src/domain/repositories/outbox.repository.ts

export interface IOutboxRepository {
  create(data: {
    topic: string;
    event: string;
    payload: any;
    key?: string;
    status?: string;
    retries?: number;
  }): Promise<any>;

  findPending(limit?: number): Promise<any[]>;
  markAsProcessed(id: string): Promise<void>;
  markAsFailed(id: string, errorMessage: string, retries: number): Promise<void>;
  lockForProcessing(id: string): Promise<boolean>;
  
}