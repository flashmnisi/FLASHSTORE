import {Request, Response} from 'express';
import {User} from '../models/UserModel';
import generateToken from '../utils/generateToken';
import { IUser} from '../type/Params';
import sendEmail from '../utils/sendEmail';
import {z} from 'zod';
import {Loved} from '../models/LovedModel';
import {Order} from '../models/OrderModel';

const addressSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  surname: z.string().optional(),
  phone: z.string().min(1, 'Phone is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  country: z.string().min(1, 'Country is required').trim(),
  houseNo: z.string().min(1, 'House number is required').trim(),
  streetName: z.string().min(1, 'Street name is required').trim(),
  postalCode: z.string().min(1, 'Postal code is required').trim(),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
});

export const RegisterUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {name, email, password} = req.body as Partial<IUser>;

  if (!name || !email || !password) {
    return res.status(400).json({message: 'Please provide all fields'});
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({message: 'Password must be at least 6 characters.'});
  }

  try {
    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({message: 'User already exists'});
    }

    const user: IUser = await User.create({name, email, password});

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id.toString()),
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({message: 'Server error'});
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: 'Please provide email and password'});
  }

  try {
    const user = await User.findOne({email}).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id.toString()),
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({message: 'Server error'});
  }
};

export const getUserProfile = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized'});
    }

    return res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      address: req.user.address,
      orders: req.user.orders,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({message: 'Server error'});
  }
};

export const updateProfile = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized'});
    }

    const validatedData = updateProfileSchema.parse(req.body);

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    if (validatedData.email && validatedData.email !== user.email) {
      const emailExists = await User.findOne({email: validatedData.email});
      if (emailExists) {
        return res.status(400).json({message: 'Email already in use'});
      }
    }

    user.name = validatedData.name || user.name;
    user.email = validatedData.email || user.email;

    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id.toString()),
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating profile:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      requestBody: req.body,
      validatedData: req.body
        ? updateProfileSchema.safeParse(req.body).data
        : null,
      validationErrors: error.errors ? Object.values(error.errors) : null,
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({message: 'Server error'});
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (!user.resetOtp) {
      user.resetOtp = {code: '', expiresAt: 0};
    }

    user.resetOtp.code = otp;
    user.resetOtp.expiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    const message = `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      text: message,
    });

    res.status(200).json({message: 'OTP sent to your email'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email, 'resetOtp.code': otp });
    if (!user || !user.resetOtp || user.resetOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.resetOtp.isVerified = true; 
    user.resetOtp.expiresAt = Date.now() + 10 * 60 * 1000; 
    await user.save();

    console.log('OTP verified for email:', email);
    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtp.isVerified || user.resetOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP not verified or expired' });
    }

    user.password = newPassword;
    user.resetOtp = undefined; // Clear OTP data
    await user.save();

    console.log('Password reset for email:', email);
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAddresses = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized'});
    }

    const user = await User.findById(req.user._id).select('address');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    return res.status(200).json({
      message: 'Addresses retrieved successfully',
      address: user.address || [],
    });
  } catch (error: any) {
    console.error('Error fetching addresses:', error.message, error.stack);
    return res.status(500).json({message: 'Server error'});
  }
};

export const addAddress = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized, no user found'});
    }

    const validatedData = addressSchema.parse(req.body);
    console.log('Validated address data:', validatedData);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    user.address = user.address || [];
    console.log('Existing addresses:', user.address);

    user.address.push(validatedData);
    await user.save();

    return res.status(200).json({
      message: 'Address added successfully',
      address: user.address,
    });
  } catch (error: any) {
    console.error('Error adding address:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      requestBody: req.body,
      validatedData: req.body ? addressSchema.safeParse(req.body).data : null,
      validationErrors: error.errors ? Object.values(error.errors) : null,
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid address data',
        errors: Object.values(error.errors).map((err: any) => ({
          path: err.path,
          message: err.message,
          value: err.value,
        })),
      });
    }

    return res.status(500).json({message: 'Server error'});
  }
};

export const updateAddress = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized'});
    }

    const {index} = req.params;
    const validatedData = addressSchema.parse(req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const addressIndex = parseInt(index, 10);
    if (
      !user.address ||
      addressIndex < 0 ||
      addressIndex >= user.address.length
    ) {
      return res.status(404).json({message: 'Address not found'});
    }

    user.address[addressIndex] = validatedData;
    await user.save();

    return res.status(200).json({
      message: 'Address updated successfully',
      address: user.address,
    });
  } catch (error: any) {
    console.error('Error updating address:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
      requestBody: req.body,
      validatedData: req.body ? addressSchema.safeParse(req.body).data : null,
      validationErrors: error.errors ? Object.values(error.errors) : null,
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid address data',
        errors: Object.values(error.errors).map((err: any) => ({
          path: err.path,
          message: err.message,
          value: err.value,
        })),
      });
    }

    return res.status(500).json({message: 'Server error'});
  }
};

export const deleteAddress = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized'});
    }

    const {index} = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const addressIndex = parseInt(index, 10);
    if (
      !user.address ||
      addressIndex < 0 ||
      addressIndex >= user.address.length
    ) {
      return res.status(404).json({message: 'Address not found'});
    }

    console.log('Deleting address:', user.address[addressIndex]);
    user.address.splice(addressIndex, 1);
    await user.save();

    return res.status(200).json({
      message: 'Address deleted successfully',
      address: user.address,
    });
  } catch (error: any) {
    console.error('Error deleting address:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    return res.status(500).json({message: 'Server error'});
  }
};

export const deleteUser = async (
  req: Request & {user?: IUser},
  res: Response,
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({message: 'Not authorized'});
    }

    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    await Loved.findOneAndDelete({userId});
    await Order.deleteMany({userId});

    return res.status(200).json({message: 'Account deleted successfully'});
  } catch (error: any) {
    console.error('Error deleting user:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id,
    });
    return res.status(500).json({message: 'Server error'});
  }
};
