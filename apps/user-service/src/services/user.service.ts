import { CreateUserDto } from '../dtos/create-user.dto';
import { publishUserRegisteredEvent } from '../events/producers/user.producer';
import logger from '@org/shared-logger';
import { User } from '../model/user.model';

export class UserService {
  async register(dto: CreateUserDto) {
    try {
      const existing = await User.findOne({ email: dto.email });
      if (existing) {
        throw new Error('User with this email already exists');
      }

      const newUser = await User.create(dto);

      // ✅ Add Kafka event publishing here
      await publishUserRegisteredEvent(newUser);

      logger.info(
        { userId: newUser._id, email: newUser.email },
        'User registered successfully'
      );

      return newUser;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error || 'Unknown error');

      logger.error(
        { error: errorMsg, email: dto.email },
        'Registration failed in service layer'
      );

      throw error instanceof Error ? error : new Error(errorMsg);
    }
  }
}

export const userService = new UserService();