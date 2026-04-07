// apps/user-service/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
import logger from '@org/shared-logger';
import { CreateUserDto } from '../dtos/create-user.dto';

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