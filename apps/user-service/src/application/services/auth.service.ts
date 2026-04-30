// apps/user-service/src/application/services/auth.service.ts

import { IUserRepository } from '../../domain/repositories/user.repository';
import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
import logger from '@org/shared-logger';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { AppError } from '../../middlewares/error.middleware';
// import { sessionService } from '../../infrastructure/cache/session.service'; // uncomment when ready

export class AuthService {
  constructor(private readonly userRepository: IUserRepository,
  private readonly outboxService: OutboxService
  ) {}

  /**
   * LOGIN - Main method used by controller
   */
  async login(dto: any) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // TODO: Add bcrypt password comparison here if not done in repository

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role || 'user',
    });

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate Access + Refresh Tokens
   */
  async generateTokens(payload: { userId: string; email: string; role: string }) {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // TODO: Store refresh token in Redis (uncomment when sessionService is ready)
    // await sessionService.createSession(payload.userId, refreshToken);

    return { accessToken, refreshToken };
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    // TODO: Clear refresh token from Redis when sessionService is implemented
    // await sessionService.deleteSession(userId);

    logger.info('User logged out successfully', { userId });
  }

  /**
   * Get current logged-in user
   */
  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Refresh Token (placeholder)
   */
  async refreshToken(refreshToken: string) {
    // TODO: Implement proper refresh token validation and rotation
    throw new AppError('Refresh token functionality not implemented yet', 501);
  }

  /**
   * Find user by email (used by ForgotPasswordUseCase)
   */
  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Generate password reset token
   */
  async generatePasswordResetToken(userId: string): Promise<string> {
    const token = Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);

    logger.info('Password reset token generated', { userId });
    return token;
  }

  /**
   * Send password reset email (mock for now)
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    logger.info('Password reset email sent (mock)', { email, resetToken });
    // TODO: Later call Notification Service via Kafka
  }

  /**
   * Publish event to Outbox
   */
  async publishEvent(event: string, payload: any): Promise<void> {
    await this.outboxService.write({
      event,
      data: payload,
      key: payload.userId || 'system',
    });
  }
}