import { Request, Response } from 'express';
import { Order } from '../models/OrderModel';
import { IUser } from '../type/Params';
import { z } from 'zod';

const orderSchema = z.object({
  orderItems: z.array(
    z.object({
      product: z.string().min(1, 'Product ID is required'),
      qty: z.number().min(1, 'Quantity must be at least 1'),
      price: z.number().min(0, 'Price must be non-negative'),
    })
  ).min(1, 'At least one order item is required'),
  shippingAddress: z.object({
    _id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    surname: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    city: z.string().min(1, 'City is required'),
    houseNo: z.string().min(1, 'House number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  itemsPrice: z.number().min(0, 'Items price must be non-negative'),
  shippingPrice: z.number().min(0, 'Shipping price must be non-negative'),
  totalPrice: z.number().min(0, 'Total price must be non-negative'),
  deliveryOption: z.string().min(1, 'Delivery option is required'),
  paymentData: z.any().optional(),
});


export const createOrder = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    console.log('Creating order for user:', req.user._id);
    console.log('Request headers:', req.headers.authorization?.slice(0, 20) + '...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const validatedData = orderSchema.parse(req.body);

    const order = await Order.create({
      user: req.user._id,
      orderItems: validatedData.orderItems,
      shippingAddress: {
        name: validatedData.shippingAddress.name,
        surname: validatedData.shippingAddress.surname,
        phone: validatedData.shippingAddress.phone,
        city: validatedData.shippingAddress.city,
        houseNo: validatedData.shippingAddress.houseNo,
        streetName: validatedData.shippingAddress.streetName,
        postalCode: validatedData.shippingAddress.postalCode,
        country: validatedData.shippingAddress.country,
      },
      paymentMethod: validatedData.paymentMethod,
      itemsPrice: validatedData.itemsPrice,
      shippingPrice: validatedData.shippingPrice,
      totalPrice: validatedData.totalPrice,
       deliveryOption: validatedData.deliveryOption,
      paymentData: validatedData.paymentData,
      isPaid: validatedData.paymentMethod === 'card' ? true : false,
      paidAt: validatedData.paymentMethod === 'card' ? new Date() : undefined,
      paymentStatus: validatedData.paymentMethod === 'card' ? 'Paid' : 'Pending',
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    console.error('Error creating order:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      requestBody: req.body,
      validationErrors: error.errors ? Object.values(error.errors) : null,
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid order data',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid order data',
        errors: Object.values(error.errors).map((err: any) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserOrders = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Orders retrieved successfully',
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching user orders:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    return res.status(500).json({ message: 'Server error' });
  }
};

export const clearUserOrders = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Order.deleteMany({ user: req.user._id });

    return res.status(200).json({ message: 'Orders cleared successfully' });
  } catch (error: any) {
    console.error('Error clearing user orders:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    return res.status(500).json({ message: 'Server error' });
  }
};