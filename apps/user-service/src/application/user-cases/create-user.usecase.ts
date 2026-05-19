// apps/user-service/src/application/use-cases/create-user.usecase.ts

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AppError } from '../../middlewares/error.middleware';
import logger from '@org/shared-logger';

export class CreateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(dto: CreateUserDto) {
    try {
      // userService.register() returns { user, accessToken, refreshToken }
      const result = await this.userService.register(dto);

      const { user, accessToken, refreshToken } = result;

      logger.info('User created successfully via UseCase', {
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        message: 'User created successfully',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin || false,
        },
      };
    } catch (error: any) {
      logger.error('CreateUserUseCase failed', {
        email: dto.email,
        error: error.message,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(error.message || 'Failed to create user', 500);
    }
  }
}