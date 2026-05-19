// apps/user-service/src/presentation/controllers/user.controller.ts

import logger from '@org/shared-logger';
import { Request, Response } from 'express';
//import { addressService } from '../../application/services/address.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { userService, authService, addressService } from '../../container';
import { CreateUserDto } from '../../application/dtos/create-user.dto';

/**
 * User Controller - Thin layer that delegates to services
 */
export const userController = {

/**
 * Register new user
 * POST /api/auth/register or /api/users/register
 */
async register(req: Request, res: Response) {
  try {
    const createUserDto = req.body as CreateUserDto;

    // ✅ This returns { user, accessToken, refreshToken }
    const result = await userService.register(createUserDto);

    const { user, accessToken, refreshToken } = result;

    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
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
    logger.error('Registration failed', {
      email: req.body?.email,
      error: error.message,
    });

    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
},


  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          _id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isAdmin: result.user.isAdmin || false,
        },
      });
    } catch (error: any) {
      logger.error('Login failed', { error: error.message });
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid credentials',
      });
    }
  },

  /**
   * Get user profile (protected)
   */
  async getProfile(req: AuthRequest, res: Response) {
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
          _id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin || false,
          address: user.addresses || [],
        },
      });
    } catch (error: any) {
      logger.error('Get profile failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  },

  /**
   * Update user profile (protected)
   */
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      const updatedUser = await userService.updateProfile(req.user.userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin || false,
        },
      });
    } catch (error: any) {
      logger.error('Update profile failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(400).json({
        success: false,
        message: error.message || 'Update failed',
      });
    }
  },

  /**
   * Delete user account (protected)
   */
  async deleteUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      await userService.deleteUser(req.user.userId);

      return res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete user failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  },

  // ====================== ADDRESS ROUTES ======================

  /**
   * Get all addresses
   */
  async getAddresses(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      const addresses = await addressService.getAddresses(req.user.userId);

      return res.status(200).json({
        success: true,
        address: addresses,
      });
    } catch (error: any) {
      logger.error('Get addresses failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  },

  /**
   * Add new address
   */
  async addAddress(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      const user = await addressService.addAddress(req.user.userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'Address added successfully',
        address: user.addresses,
      });
    } catch (error: any) {
      logger.error('Add address failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to add address',
      });
    }
  },

  /**
   * Update address by index
   */
  async updateAddress(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      const { index } = req.params;
      const addressIndex = parseInt(index, 10);

      if (isNaN(addressIndex)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid address index',
        });
      }

      const user = await addressService.updateAddress(
        req.user.userId,
        addressIndex,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        address: user.addresses,
      });
    } catch (error: any) {
      logger.error('Update address failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update address',
      });
    }
  },

  /**
   * Delete address by index
   */
  async deleteAddress(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }

      const { index } = req.params;
      const addressIndex = parseInt(index, 10);

      if (isNaN(addressIndex)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid address index',
        });
      }

      await addressService.deleteAddress(req.user.userId, addressIndex);

      return res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete address failed', {
        userId: req.user?.userId,
        error: error.message,
      });
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete address',
      });
    }
  },
};