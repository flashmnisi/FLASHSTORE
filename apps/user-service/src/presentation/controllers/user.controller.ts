import { Request, Response } from 'express';
import { UserService } from '../../application/services/user.service';
import { UserRepositoryImpl } from '../../infrastructure/persistence/repositories/user.repository.impl';import { createUserSchema } from '../../application/dtos/create-user.dto';
import { loginSchema } from '../../application/dtos/login.dto';
;

const userService = new UserService(new UserRepositoryImpl());

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    const dto = createUserSchema.parse(req.body);
    const result = await userService.register(dto);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const dto = loginSchema.parse(req.body);
    const result = await userService.login(dto);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};