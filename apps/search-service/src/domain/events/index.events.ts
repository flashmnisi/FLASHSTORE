// domain/events/index.events.ts

export const INDEX_EVENTS = {
  INDEX_SUCCESS: 'index.success',
  INDEX_FAILED: 'index.failed',
  BULK_INDEX_COMPLETED: 'index.bulk.completed',
} as const;

export interface IndexEventPayload {
  productId: string;
  index: string;
  timestamp: string;
  error?: string;
}

export interface IndexEvent {
  event: string;
  data: IndexEventPayload;
}