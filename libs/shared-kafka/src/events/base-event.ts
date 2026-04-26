/**
 * Base Event Interface for all domain events in Flashstore
 */
export interface BaseEvent<T = any> {
  event: string;
  version: number;
  timestamp: string;
  data: T;
  metadata?: {
    source?: string;
    correlationId?: string;
    [key: string]: any;
  };
}