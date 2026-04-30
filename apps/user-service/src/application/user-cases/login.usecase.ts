// apps/user-service/src/application/use-cases/login.usecase.ts

import { UserService } from '../services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { AppError } from '../../middlewares/error.middleware';

export class LoginUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(dto: LoginDto) {
    try {
      const result = await this.userService.login(dto);

      return {
        success: true,
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'Invalid credentials', 401);
    }
  }
}