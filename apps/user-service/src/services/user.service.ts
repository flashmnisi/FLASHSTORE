import bcrypt from 'bcryptjs';
import { CreateUserDto, LoginDto, UpdateProfileDto } from '../dtos/create-user.dto';
import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { User } from '../model/user.model';

export class UserService {
  async register(dto: CreateUserDto) {
    const existing = await User.findOne({ email: dto.email });
    if (existing) throw new Error('User with this email already exists');

    const user = await User.create(dto);

    // Publish Kafka event
    await publish({
      topic: 'flashstore.events',
      message: {
        event: 'user.registered',
        data: { userId: user._id, email: user.email, name: user.name },
      },
      key: String(user._id),
    });

    logger.info('User registered', { userId: user._id, email: user.email });
    return user;
  }

  async login(dto: LoginDto) {
    const user = await User.findOne({ email: dto.email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    logger.info('User logged in', { userId: user._id, email: user.email });
    return user;
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (dto.email && dto.email !== user.email) {
      const exists = await User.findOne({ email: dto.email });
      if (exists) throw new Error('Email already in use');
    }

    Object.assign(user, dto);
    await user.save();

    logger.info('Profile updated', { userId });
    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');

    // Cleanup related data (optional)
    // await Loved.deleteMany({ userId });
    // await Order.deleteMany({ userId });

    logger.info('User deleted', { userId });
    return true;
  }
}

export const userService = new UserService();