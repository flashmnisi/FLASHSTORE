export interface BaseEvent<TPayload = any> {
  event: string;              // event name
  version: number;            // for schema evolution
  timestamp: string;          // ISO date
  data: TPayload;             // actual payload
  metadata?: {
    requestId?: string;
    correlationId?: string;
    source?: string;
  };
}