// apps/user-service/src/application/services/auth.service.ts

import { IUserRepository } from '../../domain/repositories/user.repository';
import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
import logger from '@org/shared-logger';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { AppError } from '../../middlewares/error.middleware';
import { UserEntity } from '../../domain/entities/user.entities';
import { TOPICS, EVENTS } from '@org/shared-kafka';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly outboxService: OutboxService
  ) {}

  /**
   * Generate Access + Refresh Tokens
   * Accepts either UserEntity or plain payload
   */
  async generateTokens(
    input: UserEntity | { userId: string; email: string; role?: string }
  ) {
    const payload = {
      userId: input instanceof UserEntity ? input.id : input.userId,
      email: input instanceof UserEntity ? input.email : input.email,
      role:
        input instanceof UserEntity
          ? input.role || 'user'
          : input.role || 'user',
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  /**
   * LOGIN
   */
  async login(dto: any) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    await this.outboxService.write({
      topic: TOPICS.AUTH,
      event: EVENTS.USER_LOGGED_IN,
      key: user.id,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        loggedInAt: new Date().toISOString(),
      },
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
   * LOGOUT
   */
  async logout(userId: string): Promise<void> {
    await this.userRepository.clearRefreshToken(userId); 
    logger.info('User logged out successfully', { userId });
  }

  /**
   * Get Current User
   */
  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  /**
   * Refresh Token (placeholder)
   */
  async refreshToken(refreshToken: string) {
    throw new AppError('Refresh token functionality not implemented yet', 501);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async generatePasswordResetToken(userId: string): Promise<string> {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    logger.info('Password reset token generated', { userId });
    return token;
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    logger.info('Password reset email sent (mock)', { email, resetToken });
  }

  async publishEvent(event: string, payload: any): Promise<void> {
    await this.outboxService.write({
      topic: TOPICS.AUTH,
      event,
      data: payload,
      key: payload.userId || 'system',
    });
  }
}
