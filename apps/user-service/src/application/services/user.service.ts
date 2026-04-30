import { IUserRepository } from '../../domain/repositories/user.repository';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { UpdateProfileDto } from '../dtos/create-user.dto';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { addressService, authService } from '../../container';
import { AppError } from '../../middlewares/error.middleware';
//import logger from '@org/shared-logger';
import { UserEntity } from '../../domain/entities/user.entities';

export class UserService {
  constructor(private readonly userRepository: IUserRepository,
    private readonly outboxService: OutboxService
  ) 
  {}

  async register(dto: CreateUserDto) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new AppError('User exists', 400);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new UserEntity(
      '',
      dto.name,
      dto.email,
      hashedPassword
    );

    const createdUser = await this.userRepository.create(user);

    await this.outboxService.write({
      event: 'user.registered',
      data: {
        userId: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      },
      key: createdUser.id,
    });

    return createdUser;
  }

  async login(dto: LoginDto) {
    return authService.login(dto);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updatedUser = await this.userRepository.update(userId, dto);

    await this.outboxService.write({
      event: 'user.updated',
      data: {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
      key: updatedUser.id,
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    await this.userRepository.delete(userId);

    await this.outboxService.write({
      event: 'user.deleted',
      data: { userId },
      key: userId,
    });

    return true;
  }

  async clearRefreshToken(userId: string) {
    return authService.logout(userId);
  }

  async addAddress(userId: string, addressData: any) {
    return addressService.addAddress(userId, addressData);
  }

  async updateAddress(userId: string, index: number, addressData: any) {
    return addressService.updateAddress(userId, index, addressData);
  }

  async deleteAddress(userId: string, index: number) {
    return addressService.deleteAddress(userId, index);
  }

  async getAddresses(userId: string) {
    return addressService.getAddresses(userId);
  }
}