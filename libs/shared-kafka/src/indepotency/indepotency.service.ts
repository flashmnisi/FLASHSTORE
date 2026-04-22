import { redis } from '../config/redis';
import logger from '../utils/logger';

const IDEMPOTENCY_TTL = 24 * 60 * 60; // 24 hours

export class IdempotencyService {
  /**
   * Atomically check & lock event
   * Returns true if duplicate (already processed)
   */
  async isDuplicate(eventId: string, service: string): Promise<boolean> {
    const key = this.getKey(eventId, service);

    try {
      const result = await redis.set(
        key,
        'processing',
        'NX',                  // ONLY set if not exists
        'EX',
        IDEMPOTENCY_TTL
      );

      if (result === null) {
        // Key already exists → duplicate
        logger.warn(`🔄 Duplicate event blocked`, { eventId, service });
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error(`Idempotency check failed`, {
        eventId,
        service,
        error: error.message,
      });

      // Fail open (your approach is correct)
      return false;
    }
  }

  /**
   * Mark event as fully processed (optional upgrade)
   */
  async markAsProcessed(eventId: string, service: string): Promise<void> {
    const key = this.getKey(eventId, service);

    try {
      await redis.set(key, 'processed', 'EX', IDEMPOTENCY_TTL);
    } catch (error: any) {
      logger.error(`Failed to mark processed`, { eventId, service });
    }
  }

  /**
   * Optional: detect stuck "processing" states
   */
  async getStatus(eventId: string, service: string): Promise<string | null> {
    const key = this.getKey(eventId, service);
    return redis.get(key);
  }

  /**
   * Generate stable event ID (IMPORTANT improvement)
   */
  generateEventId(payload: any): string {
    // ❌ your version used Date.now() → breaks idempotency
    // ✅ must be deterministic

    return `${payload.orderId || ''}:${payload.userId || ''}:${payload.event || ''}`;
  }

  private getKey(eventId: string, service: string) {
    return `idempotency:${service}:${eventId}`;
  }
}

export const idempotencyService = new IdempotencyService();