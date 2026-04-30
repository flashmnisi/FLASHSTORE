// apps/user-service/src/application/services/password.service.ts

import bcrypt from 'bcryptjs';
import logger from '@org/shared-logger';

export class PasswordService {
  /**
   * Hash a plain text password
   */
  async hash(password: string): Promise<string> {
    try {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error: any) {
      logger.error('Password hashing failed', { error: error.message });
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare plain password with hashed password
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error: any) {
      logger.error('Password comparison failed', { error: error.message });
      throw new Error('Failed to compare password');
    }
  }
}

// Singleton instance
export const passwordService = new PasswordService();