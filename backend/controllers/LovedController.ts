import { Request, Response } from 'express';
import { Loved } from '../models/LovedModel';
import { IUser } from '../type/Params';
import { z } from 'zod';

const lovedSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export const getLovedItems = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const loved = await Loved.findOne({ userId: req.user._id });
    return res.status(200).json({
      message: 'Loved items retrieved successfully',
      lovedItems: loved ? loved.products : [],
    });
  } catch (error: any) {
    console.error('Error fetching loved items:', error.message, error.stack);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const addToLoved = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { productId } = lovedSchema.parse(req.body);
    const userId = req.user._id;

    let loved = await Loved.findOne({ userId });
    if (!loved) {
      loved = await Loved.create({ userId, products: [productId] });
    } else {
      if (!loved.products.includes(productId)) {
        loved.products.push(productId);
        await loved.save();
      }
    }

    return res.status(200).json({
      message: 'Added to loved items',
      productId,
    });
  } catch (error: any) {
    console.error('Error adding to loved items:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      requestBody: req.body,
    });
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromLoved = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { productId } = lovedSchema.parse(req.body);
    const userId = req.user._id;

    const loved = await Loved.findOne({ userId });
    if (!loved) {
      return res.status(404).json({ message: 'No loved items found' });
    }

    loved.products = loved.products.filter((id) => id !== productId);
    await loved.save();

    return res.status(200).json({
      message: 'Removed from loved items',
      productId,
    });
  } catch (error: any) {
    console.error('Error removing from loved items:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      requestBody: req.body,
    });
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const clearLovedItems = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user._id;
    await Loved.findOneAndDelete({ userId });

    return res.status(200).json({ message: 'Loved items cleared successfully' });
  } catch (error: any) {
    console.error('Error clearing loved items:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    return res.status(500).json({ message: 'Server error' });
  }
};