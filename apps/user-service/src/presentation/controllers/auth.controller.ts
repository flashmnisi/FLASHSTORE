// apps/user-service/src/presentation/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { userService } from '../../container';
import logger from '@org/shared-logger';
import { LoginDto, CreateUserDto } from '../../application/dtos/create-user.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const authController = {

  /**
   * REGISTER NEW USER
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const dto = req.body as CreateUserDto;

      const result = await userService.register(dto);

      const { user, accessToken, refreshToken } = result;

      logger.info('User registered successfully', { 
        userId: user.id, 
        email: user.email 
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
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
      logger.error('Registration failed', { error: error.message });
      return res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  },

  /**
   * LOGIN USER
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const loginDto = req.body as LoginDto;

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
  async logout(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      await userService.clearRefreshToken(req.user.userId);

      logger.info('User logged out successfully', { userId: req.user.userId });

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
   * GET CURRENT USER
   * GET /api/auth/me
   */
  async getCurrentUser(req: AuthRequest, res: Response) {
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
   * REFRESH TOKEN
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