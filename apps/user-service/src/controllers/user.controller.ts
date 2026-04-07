// apps/user-service/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
import logger from '@org/shared-logger';
import { CreateUserDto, LoginDto, UpdateProfileDto } from '../dtos/create-user.dto';

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log("📥 Received registration data:", req.body);

    const user = await userService.register(req.body as CreateUserDto);

    console.log("✅ User created from service:", {
      id: user._id,
      name: user.name,
      email: user.email
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    user.refreshToken = refreshToken;
    await user.save();

    console.log("✅ Tokens generated and user saved successfully");

    logger.info({ userId: user._id, email: user.email }, 'User registered successfully');

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    console.error("❌ Registration error:", error.message);
    console.error("Full error object:", error);

    logger.error({ 
      error: error.message || String(error), 
      email: req.body?.email 
    }, 'Registration failed');

    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};

// apps/user-service/src/controllers/user.controller.ts

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("📥 Login attempt for email:", req.body.email);

    const user = await userService.login(req.body as LoginDto);

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    logger.info(
      { userId: user._id, email: user.email },
      'User logged in successfully'
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, email: req.body?.email },
      'Login failed'
    );

    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid email or password',
    });
  }
};

export const getUserProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const user = await userService.getProfile(req.user.userId);

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address || [],
        // orders: user.orders || [],   // Uncomment when you add Order model
      },
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, userId: req.user?.userId },
      'Get profile failed'
    );
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const user = await userService.updateProfile(req.user.userId, req.body as UpdateProfileDto);

    logger.info(
      { userId: user._id },
      'Profile updated successfully'
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, userId: req.user?.userId },
      'Update profile failed'
    );

    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Update failed' 
    });
  }
};

export const deleteUser = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    await userService.deleteUser(req.user.userId);

    logger.info(
      { userId: req.user.userId },
      'User account deleted successfully'
    );

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    logger.error(
      { error: error.message, userId: req.user?.userId },
      'Delete user failed'
    );

    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};