// apps/user-service/src/application/services/address.service.ts

import { IUserRepository } from '../../domain/repositories/user.repository';
import { AppError } from '../../middlewares/error.middleware';
import logger from '@org/shared-logger';

export class AddressService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Add new address to user
   */
  async addAddress(userId: string, addressData: any) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const updatedUser = await this.userRepository.addAddress(userId, addressData);

      logger.info('Address added successfully', { userId });

      return updatedUser;
    } catch (error: any) {
      logger.error('Failed to add address', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Update address by index
   */
  async updateAddress(userId: string, index: number, addressData: any) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const updatedUser = await this.userRepository.updateAddress(userId, index, addressData);

      logger.info('Address updated successfully', { userId, addressIndex: index });

      return updatedUser;
    } catch (error: any) {
      logger.error('Failed to update address', { userId, addressIndex: index, error: error.message });
      throw error;
    }
  }

  /**
   * Delete address by index
   */
  async deleteAddress(userId: string, index: number) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await this.userRepository.deleteAddress(userId, index);

      logger.info('Address deleted successfully', { userId, addressIndex: index });

      return true;
    } catch (error: any) {
      logger.error('Failed to delete address', { userId, addressIndex: index, error: error.message });
      throw error;
    }
  }

  /**
   * Get all addresses for a user
   */
  async getAddresses(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.addresses || [];
  }
}
