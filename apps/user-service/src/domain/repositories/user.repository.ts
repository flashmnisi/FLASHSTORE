// apps/user-service/src/domain/repositories/user.repository.ts

import { UserEntity } from "../entities/user.entities";

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<boolean>;

  // Auth related
  clearRefreshToken(userId: string): Promise<void>;
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;

  // Address related
  addAddress(userId: string, addressData: any): Promise<UserEntity>;
  updateAddress(userId: string, index: number, addressData: any): Promise<UserEntity>;
  deleteAddress(userId: string, index: number): Promise<UserEntity>;
}