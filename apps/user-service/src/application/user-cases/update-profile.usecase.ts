// apps/user-service/src/application/use-cases/update-profile.usecase.ts

import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dtos/create-user.dto';
import { AppError } from '../../middlewares/error.middleware';

export class UpdateProfileUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    try {
      const updatedUser = await this.userService.updateProfile(userId, dto);

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'Failed to update profile', 400);
    }
  }
}