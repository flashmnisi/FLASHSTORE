// import { Request, Response } from 'express';
// import { generateAccessToken, generateRefreshToken } from '@org/shared-auth';
// import logger from '@org/shared-logger';
// import { CreateUserDto, LoginDto, UpdateProfileDto } from '../application/dtos/create-user.dto';
// import { userService } from '../container';
// //import { userService } from '../application/services/user.service';

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const user = await userService.register(req.body as CreateUserDto);

//     const accessToken = generateAccessToken({
//       userId: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     const refreshToken = generateRefreshToken({
//       userId: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     logger.info('User registered', { userId: user.id });

//     return res.status(201).json({
//       success: true,
//       accessToken,
//       refreshToken,
//       user: user.toJSON(), // ✅ clean
//     });

//   } catch (error: any) {
//     logger.error('Registration failed', { error: error.message });

//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // apps/user-service/src/controllers/user.controller.ts
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const loginDto = req.body as LoginDto;

//     // Call login from UserService (which delegates to AuthService)
//     const result = await userService.login(loginDto);

//     // result now has: { user, accessToken, refreshToken }
//     const { user, accessToken, refreshToken } = result;

//     return res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       accessToken,
//       refreshToken,
//       user: user.toJSON ? user.toJSON() : {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isAdmin: user.isAdmin || false,
//       },
//     });

//   } catch (error: any) {
//     logger.error('Login failed', {
//       email: req.body?.email,
//       error: error.message,
//     });

//     return res.status(401).json({
//       success: false,
//       message: error.message || 'Invalid credentials',
//     });
//   }
// };

// export const getUserProfile = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Not authorized' 
//       });
//     }

//     const user = await userService.getProfile(req.user.userId);

//     return res.status(200).json({
//       success: true,
//       user: {
//         _id: user.id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         address: user.addresses || [],
//         // orders: user.orders || [],   // Uncomment when you add Order model
//       },
//     });
//   } catch (error: any) {
//     logger.error('Get profile failed',
//       { error: error.message, userId: req.user?.userId }
//     );
//     return res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// };

// export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Not authorized' 
//       });
//     }

//     const user = await userService.updateProfile(req.user.userId, req.body as UpdateProfileDto);

//     logger.info('Profile updated successfully',
//       { userId: user.id }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: {
//         _id: user.id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//     });
//   } catch (error: any) {
//     logger.error('Update profile failed',
//       { error: error.message, userId: req.user?.userId }
//     );

//     return res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Update failed' 
//     });
//   }
// };

// export const deleteUser = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Not authorized' 
//       });
//     }

//     await userService.deleteUser(req.user.userId);

//     logger.info('User account deleted successfully',
//       { userId: req.user.userId }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Account deleted successfully',
//     });
//   } catch (error: any) {
//     logger.error('Delete user failed',
//       { error: error.message, userId: req.user?.userId }
//     );

//     return res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     });
//   }
// };

// export const getAddresses = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ success: false, message: 'Not authorized' });
//     }

//     const user = await userService.getProfile(req.user.userId);

//     return res.status(200).json({
//       success: true,
//       message: 'Addresses retrieved successfully',
//       address: user.addresses || [],
//     });
//   } catch (error: any) {
//     logger.error('Get addresses failed',
//       { error: error.message, userId: req.user?.userId }
//     );
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// export const addAddress = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ success: false, message: 'Not authorized' });
//     }

//     const user = await userService.addAddress(req.user.userId, req.body);

//     logger.info('Address added successfully',
//       { userId: req.user.userId }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Address added successfully',
//       address: user.addresses,
//     });
//   } catch (error: any) {
//     logger.error('Add address failed',
//       { error: error.message, userId: req.user?.userId },
//     );

//     return res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to add address' 
//     });
//   }
// };

// export const updateAddress = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ success: false, message: 'Not authorized' });
//     }

//     const { index } = req.params;
//     const addressIndex = parseInt(index, 10);

//     const user = await userService.updateAddress(req.user.userId, addressIndex, req.body);

//     logger.info('Address updated successfully',
//       { userId: req.user.userId, addressIndex }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Address updated successfully',
//       address: user.addresses,
//     });
//   } catch (error: any) {
//     logger.error( 'Update address failed',
//       { error: error.message, userId: req.user?.userId }
//     );

//     return res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to update address' 
//     });
//   }
// };

// export const deleteAddress = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user?.userId) {
//       return res.status(401).json({ success: false, message: 'Not authorized' });
//     }

//     const { index } = req.params;
//     const addressIndex = parseInt(index, 10);

//     await userService.deleteAddress(req.user.userId, addressIndex);

//     logger.info('Address deleted successfully',
//       { userId: req.user.userId, addressIndex }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Address deleted successfully',
//     });
//   } catch (error: any) {
//     logger.error('Delete address failed',
//       { error: error.message, userId: req.user?.userId }
//     );

//     return res.status(400).json({ 
//       success: false, 
//       message: error.message || 'Failed to delete address' 
//     });
//   }
// };