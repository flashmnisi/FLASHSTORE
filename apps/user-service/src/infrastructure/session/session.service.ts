import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export class SessionService {
  /**
   * Create a new session (store refresh token)
   */
  async createSession(userId: string, refreshToken: string): Promise<void> {
    try {
      const redis = await getRedis();
      const key = this.buildKey(userId);

      await redis.set(key, refreshToken, { EX: SESSION_TTL });

      logger.info('Session created successfully', { userId });
    } catch (error: any) {
      logger.error('Failed to create session', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get refresh token for a user
   */
  async getSession(userId: string): Promise<string | null> {
    try {
      const redis = await getRedis();
      const key = this.buildKey(userId);

      const token = await redis.get(key);

      if (token) {
        logger.debug('Session retrieved', { userId });
      }

      return token;
    } catch (error: any) {
      logger.error('Failed to get session', {
        userId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Delete a specific session (logout from one device)
   */
  async deleteSession(userId: string): Promise<void> {
    try {
      const redis = await getRedis();
      const key = this.buildKey(userId);

      await redis.del(key);

      logger.info('Session deleted successfully', { userId });
    } catch (error: any) {
      logger.error('Failed to delete session', {
        userId,
        error: error.message,
      });
    }
  }

  /**
   * Delete all sessions for a user (logout from all devices)
   */
  async deleteAllSessions(userId: string): Promise<void> {
    try {
      const redis = await getRedis();
      const pattern = `session:${userId}:*`;

      // Note: redis.keys() is not recommended in production for large datasets
      // Consider using SCAN in production for better performance
      const keys = await redis.keys(pattern);

      if (keys.length > 0) {
        await redis.del(keys);
        logger.info('All sessions deleted for user', { userId, count: keys.length });
      }
    } catch (error: any) {
      logger.error('Failed to delete all sessions', {
        userId,
        error: error.message,
      });
    }
  }

  /**
   * Check if session exists (refresh token is valid)
   */
  async isValidSession(userId: string, refreshToken: string): Promise<boolean> {
    try {
      const storedToken = await this.getSession(userId);
      return storedToken === refreshToken;
    } catch (error) {
      return false;
    }
  }

  /**
   * Build Redis key for session
   */
  private buildKey(userId: string): string {
    return `session:${userId}`;
  }
}

// Singleton export
export const sessionService = new SessionService();