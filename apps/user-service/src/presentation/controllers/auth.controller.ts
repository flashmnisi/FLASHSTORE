// apps/user-service/src/presentation/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { userService } from '../../container';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import logger from '@org/shared-logger';
import { LoginDto } from '../../application/dtos/create-user.dto';

export const authController = {

  /**
   * LOGIN
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const loginDto = req.body as LoginDto;

      // userService.login() now returns { user, accessToken, refreshToken }
      const result = await userService.login(loginDto);

      const { user, accessToken, refreshToken } = result;

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin || false,
        },
      });
    } catch (error: any) {
      logger.error('Login failed', {
        email: req.body?.email,
        error: error.message,
      });

      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password',
      });
    }
  },

  /**
   * LOGOUT
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      await userService.clearRefreshToken(req.user.userId);

      logger.info('User logged out successfully', {
        userId: req.user.userId,
      });

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logger.error('Logout failed', {
        userId: req.user?.userId,
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  },

  /**
   * GET CURRENT USER (ME)
   * GET /api/auth/me
   */
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      const user = await userService.getProfile(req.user.userId);

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin || false,
        },
      });
    } catch (error: any) {
      logger.error('Get current user failed', {
        userId: req.user?.userId,
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user information',
      });
    }
  },

  /**
   * REFRESH TOKEN (Optional - implement later)
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      // TODO: Implement proper refresh token logic
      return res.status(501).json({
        success: false,
        message: 'Refresh token functionality not implemented yet',
      });
    } catch (error: any) {
      logger.error('Refresh token failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to refresh token',
      });
    }
  },
};