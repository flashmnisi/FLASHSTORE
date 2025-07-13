import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Order } from '../models/OrderModel';
import { IUser } from '../type/Params';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const createPaymentIntentSchema = z.object({
  amount: z.number().min(50, 'Amount must be at least 50 cents'),
  currency: z.string().min(1, 'Currency is required'),
});

const createOrderSchema = z.object({
  orderItems: z.array(
    z.object({
      product: z.string(),
      qty: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    surname: z.string().optional(),
    phone: z.string(),
    city: z.string(),
    houseNo: z.string(),
    streetName: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string(),
  itemsPrice: z.number().min(0),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  deliveryOption: z.string(),
  paymentData: z.object({ paymentIntentId: z.string() }).optional(),
  isPaid: z.boolean(),
});

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No authentication token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id };
    console.log('Token verified successfully:', req.user);
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  console.log('Received request to /payment/create-order:', {
    body: req.body,
    headers: req.headers,
  });

  try {
    const validated = createPaymentIntentSchema.parse(req.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: validated.amount,
      currency: validated.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    console.log('Stripe Payment Intent:', paymentIntent);

    return res.status(200).json({
      message: 'Stripe Payment Intent created successfully',
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error: any) {
    console.error('Error creating Stripe Payment Intent:', {
      message: error.message,
      stack: error.stack,
      details: error,
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input data',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (error.type && error.code) {
      return res.status(400).json({
        message: error.message || 'Stripe error',
        details: { type: error.type, code: error.code },
      });
    }

    return res.status(500).json({ message: 'Server error', details: error.message });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {

  try {
    const validated = createOrderSchema.parse(req.body);

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (validated.paymentMethod === 'card' && validated.paymentData?.paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(validated.paymentData.paymentIntentId);
      
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ message: 'Payment not successful', details: { status: paymentIntent.status } });
        }
        if (!validated.isPaid) {
          console.warn('isPaid was false for card payment, correcting to true');
          validated.isPaid = true;
        }
      } catch (error: any) {
        console.error('Stripe payment intent retrieval failed:', {
          message: error.message,
          code: error.code,
          type: error.type,
        });
        return res.status(400).json({ message: 'Invalid payment intent', details: error.message });
      }
    } else if (validated.paymentMethod === 'card' && !validated.paymentData?.paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID required for card payment' });
    }

    const order = new Order({
      ...validated,
      user: req.user.id,
      paidAt: validated.isPaid ? new Date() : undefined,
      createdAt: new Date(),
    });

    const savedOrder = await order.save();
    console.log('Order created:', {
      _id: savedOrder._id,
      isPaid: savedOrder.isPaid,
      paymentMethod: savedOrder.paymentMethod,
      paymentData: savedOrder.paymentData,
    });
    return res.status(201).json(savedOrder);
  } catch (error: any) {
    console.error('Error creating order:', {
      message: error.message,
      stack: error.stack,
      details: error,
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

    return res.status(500).json({ message: 'Server error', details: error.message });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const orders = await Order.find({ user: req.user.id });
    console.log('Fetched orders:', orders.map(o => ({
      _id: o._id,
      isPaid: o.isPaid,
      paymentMethod: o.paymentMethod,
    })));
    res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders', details: error.message });
  }
};