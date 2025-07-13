import { Request, Response } from "express";
import { ProductProps } from "../type/Params";
import { Product } from "../models/ProductModel";

export const CreateProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name,brand,price,oldPrice,quantity,category,inStock,trends,description,sale } = req.body as ProductProps;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ error: "No images uploaded" });
            return;
        }
        const basePath = "http://localhost:8000/assets/";
        const images = files.map(file => `${basePath}${file.filename}`);

        const products = new Product({
            name,
            images,
            brand,
            price,
            oldPrice,
            quantity,
            category,
            inStock,
            trends,
            description,
            sale
        });

        const saved = await products.save();

        res.status(201).json({
            message: "Products created with embedded images",
            data: saved,
        });

    } catch (error) {
        console.error("CreateCategory error:", error);
        res.status(500).json({ error: "Failed to create carousel" });
    }
};

export const getProducts = async (req:Request, res:Response) => {
    try {
        const respond = await Product.find();  
        res.status(200).json({respond});
        console.log('Products',respond)
    } catch (error) {
        res.status(500).json(`Category Image not found ${error}`) 
    }
}