import { Request, Response } from 'express';
import { CATEGORIES } from '../models/CategoryModel';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CATEGORIES.find();
    res.status(200).json({ respond: categories });
  } catch (error: any) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};

export const CreateCategories = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const files = req.files as Express.Multer.File[];
    if (!name) {
      res.status(400).json({ error: 'Missing required field: name' });
      return;
    }
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No images uploaded' });
      return;
    }

    const API_URL = 'http://localhost:8000'; 
    const images = files.map((file) => `${API_URL}/assets/${file.filename}`);

    const category = new CATEGORIES({ name, images });
    const saved = await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      data: saved,
    });
  } catch (error: any) {
    console.error('createCategory error:', error);
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
};