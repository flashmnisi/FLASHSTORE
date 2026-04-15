import { IUserRepository } from '../../domain/repositories/user.repository';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
import { UserEntity } from '../../domain/entities/user.entities';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';

import { EventWriter } from '../../infrastructure/kafka/event.writer';
import { AppError } from '../../middlewares/error.middleware';


export class UserService {
  private eventWriter = new EventWriter();

  constructor(private readonly userRepository: IUserRepository) {}

  async register(dto: CreateUserDto) {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new UserEntity('', dto.name, dto.email, hashedPassword);

    const createdUser = await this.userRepository.create(user);

    // ✅ WRITE EVENT TO OUTBOX (NOT KAFKA DIRECTLY)
    await this.eventWriter.write({
      event: 'user.registered',
      data: {
        userId: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      },
    });

    const accessToken = generateAccessToken({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    });

    const refreshToken = generateRefreshToken({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role, 
    });

    return { user: createdUser, accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // ✅ EVENT → OUTBOX
    await this.eventWriter.write({
      event: 'user.logged_in',
      data: {
        userId: user.id,
        email: user.email,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { user, accessToken, refreshToken };
  }
}