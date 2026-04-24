import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';
import crypto from 'crypto';

const IDEMPOTENCY_TTL = 24 * 60 * 60; // 24 hours
const PROCESSING_TTL = 5 * 60; // 5 minutes (short lock for in-progress)

export class IdempotencyService {
  /**
   * Atomically check & lock event
   */
  async isDuplicate(eventId: string, service: string): Promise<boolean> {
    const client = await getRedis();
    const key = this.getKey(eventId, service);

    try {
      const result = await client.set(
        key,
        'processing',
        {
          NX: true,              // Only set if NOT exists
          EX: PROCESSING_TTL,    // Short lock
        }
      );

      if (result === null) {
        logger.warn(
          { eventId, service },
          '🔄 Duplicate event blocked'
        );
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error(
        { eventId, service, error: error.message },
        '❌ Idempotency check failed'
      );

      // Fail OPEN (important in distributed systems)
      return false;
    }
  }

  /**
   * Mark event as fully processed
   */
  async markAsProcessed(eventId: string, service: string): Promise<void> {
    const client = await getRedis();
    const key = this.getKey(eventId, service);

    try {
      await client.set(key, 'processed', {
        EX: IDEMPOTENCY_TTL,
      });

      logger.info(
        { eventId, service },
        '✅ Event marked as processed'
      );
    } catch (error: any) {
      logger.error(
        { eventId, service, error: error.message },
        '❌ Failed to mark event as processed'
      );
    }
  }

  /**
   * Check current status
   */
  async getStatus(eventId: string, service: string): Promise<string | null> {
    const client = await getRedis();
    const key = this.getKey(eventId, service);

    return client.get(key);
  }

  /**
   * 🔥 STRONG EVENT ID GENERATION (PRODUCTION SAFE)
   */
  generateEventId(payload: any): string {
    // Use stable hash instead of string concat
    const base = JSON.stringify({
      orderId: payload?.orderId,
      userId: payload?.userId,
      event: payload?.event,
      amount: payload?.amount,
    });

    return crypto.createHash('sha256').update(base).digest('hex');
  }

  private getKey(eventId: string, service: string) {
    return `idempotency:${service}:${eventId}`;
  }
}

export const idempotencyService = new IdempotencyService();