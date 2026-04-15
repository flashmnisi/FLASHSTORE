// import { CreateUserDto, LoginDto, UpdateProfileDto } from '../dtos/create-user.dto';
// import { publishUserRegisteredEvent } from '../events/producers/user.producer';
// import logger from '@org/shared-logger';
// import { User } from '../model/user.model';

// export class UserService {
//   async register(dto: CreateUserDto) {
//     try {
//       const existing = await User.findOne({ email: dto.email });
//       if (existing) {
//         throw new Error('User with this email already exists');
//       }

//       const newUser = await User.create(dto);

//       await publishUserRegisteredEvent(newUser);

//       logger.info(
//         { userId: newUser._id, email: newUser.email },
//         'User registered successfully'
//       );

//       return newUser;
//     } catch (error: unknown) {
//       const errorMsg = error instanceof Error ? error.message : String(error || 'Unknown error');

//       logger.error(
//         { error: errorMsg, email: dto.email },
//         'Registration failed in service layer'
//       );

//       throw new Error(errorMsg);
//     }
//   }

//   async login(dto: LoginDto) {
//     try {
//       const user = await User.findOne({ email: dto.email }).select('+password');
//       if (!user) throw new Error('Invalid credentials');

//       const isValid = await user.comparePassword(dto.password);
//       if (!isValid) throw new Error('Invalid credentials');

//       logger.info(
//         { userId: user._id, email: user.email },
//         'User logged in successfully'
//       );

//       return user;
//     } catch (error: unknown) {
//       const errorMsg = error instanceof Error ? error.message : String(error || 'Unknown error');

//       logger.error(
//         { error: errorMsg, email: dto.email },
//         'Login failed in service layer'
//       );

//       throw new Error(errorMsg);
//     }
//   }

//   async getProfile(userId: string) {
//     const user = await User.findById(userId);
//     if (!user) throw new Error('User not found');
//     return user;
//   }

//   async updateProfile(userId: string, dto: UpdateProfileDto) {
//     const user = await User.findByIdAndUpdate(userId, dto, { new: true });
//     if (!user) throw new Error('User not found');
//     return user;
//   }

//   async deleteUser(userId: string) {
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) throw new Error('User not found');
//     return true;
//   }

//   // ==================== ADDRESS MANAGEMENT ====================

//   async addAddress(userId: string, addressData: any) {
//     const user = await User.findById(userId);
//     if (!user) throw new Error('User not found');

//     user.address = user.address || [];
//     user.address.push(addressData);

//     await user.save();
//     return user;
//   }

//   async getAddresses(userId: string) {
//     const user = await User.findById(userId).select('address');
//     if (!user) throw new Error('User not found');
//     return user;
//   }

//   async updateAddress(userId: string, index: number, addressData: any) {
//     const user = await User.findById(userId);
//     if (!user) throw new Error('User not found');

//     if (!user.address || index < 0 || index >= user.address.length) {
//       throw new Error('Address not found at given index');
//     }

//     user.address[index] = addressData;
//     await user.save();
//     return user;
//   }

//   async deleteAddress(userId: string, index: number) {
//     const user = await User.findById(userId);
//     if (!user) throw new Error('User not found');

//     if (!user.address || index < 0 || index >= user.address.length) {
//       throw new Error('Address not found at given index');
//     }

//     user.address.splice(index, 1);
//     await user.save();
//     return user;
//   }
// }

// export const userService = new UserService();