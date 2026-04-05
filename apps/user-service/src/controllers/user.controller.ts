import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
import { publishUserRegisteredEvent } from '../events/producers/user.producer';
import logger from '@org/shared-logger';
import { CreateUserDto, LoginDto, UpdateProfileDto } from '../dtos/create-user.dto';

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body as CreateUserDto);

    // Publish Kafka event
    await publishUserRegisteredEvent(user);

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

    // ✅ Fixed Pino logging
    logger.info(
      { userId: user._id, email: user.email },
      'User registered successfully'
    );

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
    logger.error(
      { 
        error: error.message, 
        email: req.body?.email 
      },
      'Registration failed'
    );

    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
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
      { 
        error: error.message, 
        email: req.body?.email 
      },
      'Login failed'
    );

    return res.status(401).json({ 
      success: false, 
      message: error.message || 'Invalid credentials' 
    });
  }
};

export const getUserProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
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
      },
    });
  } catch (error: any) {
    logger.error(
      { error: error.message },
      'Get profile failed'
    );
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
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
      { error: error.message },
      'Update profile failed'
    );
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await userService.deleteUser(req.user.userId);

    logger.info(
      { userId: req.user.userId },
      'User account deleted'
    );

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    logger.error(
      { error: error.message },
      'Delete user failed'
    );
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Password reset placeholders (from your old code)
export const forgotPassword = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Forgot password not implemented yet' });
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'OTP verification not implemented yet' });
};

export const resetPassword = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Reset password not implemented yet' });
};