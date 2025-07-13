import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { IUser } from '../type/Params';
import { Product } from '../models/ProductModel';

export const getUserCart = async (req: Request & { user?: IUser }, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('cart.items.product');

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json(user.cart);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const addToCart = async (req: Request & { user?: IUser }, res: Response) => {
  const { productId, count } = req.body;

  if (!productId || !count || count < 1) {
    return res.status(400).json({ message: 'Invalid productId or count' });
  }

  console.log('addToCart request:', { productId, count, user: req.user?._id });

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found for ID: ${productId}` });
    }
    if (!product.inStock) {
      return res.status(400).json({ message: `Product ${productId} is out of stock` });
    }
    if (product.quantity < count) {
      return res.status(400).json({ message: `Only ${product.quantity} items available` });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { $push: { 'cart.items': { product: productId, count } } },
      { new: true }
    ).populate('cart.items.product');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addedItem = updatedUser.cart.items[updatedUser.cart.items.length - 1];
    return res.status(200).json({ item: addedItem });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

export const updateCartItem = async (req: Request & { user?: IUser }, res: Response) => {
  const { productId, count } = req.body;

  if (!productId || count === undefined || count < 0) {
    return res.status(400).json({ message: 'Invalid productId or count' });
  }

  console.log('updateCartItem request:', { productId, count, user: req.user?._id });

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found for ID: ${productId}` });
    }
    if (count > 0 && !product.inStock) {
      return res.status(400).json({ message: `Product ${productId} is out of stock` });
    }
    if (count > 0 && product.quantity < count) {
      return res.status(400).json({ message: `Only ${product.quantity} items available` });
    }

    let updatedUser;
    if (count === 0) {
      // Remove item
      updatedUser = await User.findByIdAndUpdate(
        req.user!._id,
        { $pull: { 'cart.items': { product: productId } } },
        { new: true }
      ).populate('cart.items.product');
    } else {
      // Update count
      updatedUser = await User.findOneAndUpdate(
        { _id: req.user!._id, 'cart.items.product': productId },
        { $set: { 'cart.items.$.count': count } },
        { new: true }
      ).populate('cart.items.product');
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User or item not found' });
    }

    const updatedItem = updatedUser.cart.items.find((item: any) => item.product._id.toString() === productId);
    return res.status(200).json({ item: updatedItem || { product, count: 0 } });
  } catch (error: any) {
    console.error('Update cart item error:', error);
    return res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};



export const removeFromCart = async (req: Request & { user?: IUser }, res: Response) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart.items = user.cart.items.filter(item => item.product.toString() !== productId);
    await user.save();

    return res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req: Request & { user?: IUser }, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart.items = [];
    await user.save();

    return res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateCartQuantity = async (req: Request & { user?: IUser }, res: Response) => {
  const { count } = req.body;
  const { productId } = req.params;

  try {
    if (!count || count < 1) return res.status(400).json({ message: 'Invalid count' });

    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    const product = await Product.findById(productId);
    if (!product || !product.inStock) return res.status(400).json({ message: 'Product not available' });

    if (count > product.quantity) {
      return res.status(400).json({ message: `Only ${product.quantity} available` });
    }

    item.count = count;
    await user.save();
    await user.populate('cart.items.product');

    res.json({ cart: user.cart });
  } catch (err) {
    console.error('Update cart quantity error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
