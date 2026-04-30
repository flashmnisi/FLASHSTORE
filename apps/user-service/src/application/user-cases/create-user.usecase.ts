// apps/user-service/src/application/use-cases/create-user.usecase.ts

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AppError } from '../../middlewares/error.middleware';
import logger from '@org/shared-logger';

export class CreateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(dto: CreateUserDto) {
    try {
      // Optional: Add extra validation or business logic here if needed

      const createdUser = await this.userService.register(dto);

      // Note: Your current register() returns only the UserEntity
      // If you want tokens returned from use case, you should either:
      // Option A: Modify userService.register to also return tokens, OR
      // Option B: Generate tokens here in the use case (recommended for separation)

      return {
        success: true,
        message: 'User created successfully',
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          isAdmin: createdUser.isAdmin,
        },
        // tokens will be generated in controller or auth service layer
      };
    } catch (error: any) {
      logger.error('CreateUserUseCase failed', {
        email: dto.email,
        error: error.message,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error.message || 'Failed to create user',
        500
      );
    }
  }
}