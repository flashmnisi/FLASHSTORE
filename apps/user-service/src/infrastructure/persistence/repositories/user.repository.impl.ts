// apps/user-service/src/infrastructure/persistence/mongoose/repositories/user.repository.impl.ts

import logger from '@org/shared-logger';
//import { UserEntity } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { AppError } from '../../../middlewares/error.middleware';
import { UserModel } from '../model/user.model';   // ← Use UserModel
import { UserEntity } from '../../../domain/entities/user.entities';

export class UserRepositoryImpl implements IUserRepository {

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const userDoc = await UserModel.findById(id);
      if (!userDoc) return null;

      return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,         
        userDoc.updatedAt,          
        userDoc.addresses || [],     
        userDoc.phone,              
        userDoc.refreshToken 
      );
    } catch (error: any) {
      logger.error('Failed to find user by id', { userId: id, error: error.message });
      throw new AppError('Database error', 500);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const userDoc = await UserModel.findOne({ email });
      if (!userDoc) return null;

      return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,           // ← 7th param: createdAt (Date)
        userDoc.updatedAt,           // ← 8th param: updatedAt
        userDoc.addresses || [],     // ← 9th param: addresses
        userDoc.phone,               // ← 10th param: phone
        userDoc.refreshToken 
      );
    } catch (error: any) {
      logger.error('Failed to find user by email', { email, error: error.message });
      throw new AppError('Database error', 500);
    }
  }

  async create(user: UserEntity): Promise<UserEntity> {
    try {
      const userDoc = await UserModel.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isAdmin: user.isAdmin || false,
        addresses: user.addresses || [],
        phone: user.phone,
      });

      return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,           // ← 7th param: createdAt (Date)
        userDoc.updatedAt,           // ← 8th param: updatedAt
        userDoc.addresses || [],     // ← 9th param: addresses
        userDoc.phone,               // ← 10th param: phone
        userDoc.refreshToken 
      );
    } catch (error: any) {
      logger.error('Failed to create user', { email: user.email, error: error.message });
      throw new AppError('Failed to create user', 500);
    }
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );

      if (!userDoc) throw new AppError('User not found', 404);

      return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,           // ← 7th param: createdAt (Date)
        userDoc.updatedAt,           // ← 8th param: updatedAt
        userDoc.addresses || [],     // ← 9th param: addresses
        userDoc.phone,               // ← 10th param: phone
        userDoc.refreshToken 
      );
    } catch (error: any) {
      logger.error('Failed to update user', { userId: id, error: error.message });
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return !!result;
    } catch (error: any) {
      logger.error('Failed to delete user', { userId: id, error: error.message });
      throw error;
    }
  }

  async clearRefreshToken(userId: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    } catch (error: any) {
      logger.warn('Failed to clear refresh token', { userId, error: error.message });
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    try {
      if (refreshToken) {
        await UserModel.findByIdAndUpdate(userId, { refreshToken });
      } else {
        await this.clearRefreshToken(userId);
      }
    } catch (error: any) {
      logger.warn('Failed to update refresh token', { userId, error: error.message });
    }
  }

  // ====================== ADDRESS METHODS ======================

  async addAddress(userId: string, addressData: any): Promise<UserEntity> {
    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: addressData } },
      { new: true }
    );

    if (!userDoc) throw new AppError('User not found', 404);

    return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,           // ← 7th param: createdAt (Date)
        userDoc.updatedAt,           // ← 8th param: updatedAt
        userDoc.addresses || [],     // ← 9th param: addresses
        userDoc.phone,               // ← 10th param: phone
        userDoc.refreshToken 
    );
  }

  async updateAddress(userId: string, index: number, addressData: any): Promise<UserEntity> {
    const userDoc = await UserModel.findById(userId);
    if (!userDoc) throw new AppError('User not found', 404);

    if (!userDoc.addresses || index < 0 || index >= userDoc.addresses.length) {
      throw new AppError('Invalid address index', 400);
    }

    userDoc.addresses[index] = { ...userDoc.addresses[index], ...addressData };
    await userDoc.save();

    return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,           // ← 7th param: createdAt (Date)
        userDoc.updatedAt,           // ← 8th param: updatedAt
        userDoc.addresses || [],     // ← 9th param: addresses
        userDoc.phone,               // ← 10th param: phone
        userDoc.refreshToken 
    );
  }

  async deleteAddress(userId: string, index: number): Promise<UserEntity> {
    const userDoc = await UserModel.findById(userId);
    if (!userDoc) throw new AppError('User not found', 404);

    if (!userDoc.addresses || index < 0 || index >= userDoc.addresses.length) {
      throw new AppError('Invalid address index', 400);
    }

    userDoc.addresses.splice(index, 1);
    await userDoc.save();

    return new UserEntity(
        userDoc._id.toString(),
        userDoc.name,
        userDoc.email,
        userDoc.password,
        userDoc.role || 'user',
        userDoc.isAdmin || false,
        userDoc.createdAt,           // ← 7th param: createdAt (Date)
        userDoc.updatedAt,           // ← 8th param: updatedAt
        userDoc.addresses || [],     // ← 9th param: addresses
        userDoc.phone,               // ← 10th param: phone
        userDoc.refreshToken 
    );
  }
}