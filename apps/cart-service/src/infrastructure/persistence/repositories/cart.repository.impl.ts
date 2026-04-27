import { ICartRepository } from '../../../application/interfaces/cart.repository';
import { CartEntity } from '../../../domain/entities/cart.entity';
import { CartItemEntity } from '../../../domain/entities/cart-item.entity';
import { CartModel } from '../models/cart.model';

export class CartRepositoryImpl implements ICartRepository {

  async findByUserId(userId: string): Promise<CartEntity | null> {
    const doc = await CartModel.findOne({ userId }).lean();

    if (!doc) return null;

    return new CartEntity(
      doc._id.toString(),
      doc.userId,
      doc.items.map(
        i => new CartItemEntity(
          i.productId, 
          i.quantity, 
          i.price, 
          i.name || '',           // ← Fixed: provide default
          i.image
        )
      ),
      doc.createdAt,
      doc.updatedAt
    );
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    const updated = await CartModel.findOneAndUpdate(
      { userId: cart.userId },
      {
        items: cart.items,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    if (!updated) {
      throw new Error('Failed to save cart');
    }

    return new CartEntity(
      updated._id.toString(),
      updated.userId,
      updated.items.map(
        i => new CartItemEntity(
          i.productId, 
          i.quantity, 
          i.price, 
          i.name || '',           // ← Fixed
          i.image
        )
      ),
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(userId: string): Promise<void> {
    await CartModel.deleteOne({ userId });
  }
}