import { CreateUserDto, LoginDto, UpdateProfileDto } from '../dtos/create-user.dto';
import { publishUserRegisteredEvent } from '../events/producers/user.producer';
import logger from '@org/shared-logger';
import { User } from '../model/user.model';

export class UserService {
  async register(dto: CreateUserDto) {
    try {
      // Check for existing user
      const existing = await User.findOne({ email: dto.email });
      if (existing) {
        throw new Error('User with this email already exists');
      }

      // Create new user (password hashing happens automatically in model)
      const newUser = await User.create(dto);

      // Publish Kafka event
      await publishUserRegisteredEvent(newUser);

      logger.info(
        { userId: newUser._id, email: newUser.email },
        'User registered successfully'
      );

      return newUser;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error || 'Unknown error');

      logger.error(
        { 
          error: errorMsg, 
          email: dto.email 
        },
        'Registration failed in service layer'
      );

      throw new Error(errorMsg);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await User.findOne({ email: dto.email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await user.comparePassword(dto.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      logger.info(
        { userId: user._id, email: user.email },
        'User logged in successfully'
      );

      return user;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error || 'Unknown error');

      logger.error(
        { 
          error: errorMsg, 
          email: dto.email 
        },
        'Login failed in service layer'
      );

      throw new Error(errorMsg);
    }
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await User.findByIdAndUpdate(userId, dto, { new: true });
    if (!user) throw new Error('User not found');
    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return true;
  }
}

export const userService = new UserService();