// apps/user-service/src/application/use-cases/forgot-password.usecase.ts

import { AuthService } from '../services/auth.service';
import { AppError } from '../../middlewares/error.middleware';
import logger from '@org/shared-logger';

export class ForgotPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(email: string): Promise<void> {
    try {
      // 1. Find user by email (silent if not found for security)
      const user = await this.authService.findByEmail(email);

      if (!user) {
        logger.info('Forgot password requested for non-existent email', { email });
        return; // Silent success - do not reveal existence
      }

      // 2. Generate reset token
      const resetToken = await this.authService.generatePasswordResetToken(user.id);

      // 3. Send password reset email
      await this.authService.sendPasswordResetEmail(user.email, resetToken);

      // 4. Publish event to Outbox
      await this.authService.publishEvent('user.password_reset_requested', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      logger.info('Password reset requested successfully', {
        userId: user.id,
        email: user.email,
      });

    } catch (error: any) {
      logger.error('ForgotPasswordUseCase failed', {
        email,
        error: error.message,
      });

      throw new AppError('Failed to process password reset request', 500);
    }
  }
}