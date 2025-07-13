import express, {Application,Request, Response, NextFunction } from "express"
import { CartRoutes, CategoryRoutes, ProductRoutes } from "../routes";
import { PORT } from "../config";
import { UserRoutes } from "../routes/UserRoutes";
import { createPaymentOrder } from "../controllers/PaymentController";
import { protect } from "../middleware/authMiddleware";


export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/assets", express.static("assets"));
    app.use("/categories", CategoryRoutes);
    app.use("/products", ProductRoutes)
    app.use('/user', UserRoutes);
    app.use('/cart', CartRoutes);
    app.post('/payment/create-order', protect, createPaymentOrder); 

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});
    app.listen(8000, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
   
    return app
}
