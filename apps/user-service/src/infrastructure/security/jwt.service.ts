// apps/user-service/src/application/services/jwt.service.ts

import jwt from 'jsonwebtoken';
import env from '../../config/env';
import logger from '@org/shared-logger';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService {
  /**
   * Generate Access Token (short-lived)
   */
  generateAccessToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '15m',
      });
    } catch (error: any) {
      logger.error('Failed to generate access token', { error: error.message });
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generate Refresh Token (long-lived)
   */
  generateRefreshToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
    } catch (error: any) {
      logger.error('Failed to generate refresh token', { error: error.message });
      throw new Error('Refresh token generation failed');
    }
  }

  /**
   * Verify Access Token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error: any) {
      logger.warn('Token verification failed', { error: error.message });
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Verify Refresh Token
   */
  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error: any) {
      logger.warn('Refresh token verification failed', { error: error.message });
      throw new Error('Invalid or expired refresh token');
    }
  }
}

// Singleton instance
export const jwtService = new JwtService();