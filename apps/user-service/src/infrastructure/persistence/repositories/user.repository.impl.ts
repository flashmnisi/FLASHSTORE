import { UserEntity } from "../../../domain/entities/user.entities";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UserModel } from "../model/user.model";

export class UserRepositoryImpl implements IUserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isAdmin: user.isAdmin,
    });

    return new UserEntity(
      created._id.toString(),
      created.name,
      created.email,
      created.password,
      created.role,
      created.isAdmin,
      created.createdAt
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email }).select('+password');
    if (!doc) return null;

    return new UserEntity(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.role,
      doc.isAdmin,
      doc.createdAt
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id).select('+password');
    if (!doc) return null;

    return new UserEntity(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.role,
      doc.isAdmin,
      doc.createdAt
    );
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updated = await UserModel.findByIdAndUpdate(user.id, user, { new: true });
    if (!updated) throw new Error('User not found');

    return new UserEntity(
      updated._id.toString(),
      updated.name,
      updated.email,
      updated.password,
      updated.role,
      updated.isAdmin,
      updated.createdAt
    );
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}