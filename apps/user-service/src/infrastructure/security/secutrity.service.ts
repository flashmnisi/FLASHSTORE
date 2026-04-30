// import { JwtService } from './jwt.service';
// import { PasswordService } from './password.service';
// import { JwtPayload, TokenPair } from './types';

// export class SecurityService {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly passwordService: PasswordService
//   ) {}

//   /**
//    * Hash a plain password
//    */
//   async hashPassword(password: string): Promise<string> {
//     return this.passwordService.hash(password);
//   }

//   /**
//    * Compare plain password with hashed password
//    */
//   async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//     return this.passwordService.compare(password, hashedPassword);
//   }

//   /**
//    * Generate Access + Refresh tokens
//    */
//   generateTokens(payload: JwtPayload): TokenPair {
//     const accessToken = this.jwtService.generateToken(payload, '15m');
//     const refreshToken = this.jwtService.generateRefreshToken(payload);

//     return {
//       accessToken,
//       refreshToken,
//     };
//   }

//   /**
//    * Verify access token and return payload
//    */
//   verifyAccessToken(token: string): JwtPayload {
//     return this.jwtService.verifyToken(token);
//   }

//   /**
//    * Verify refresh token and return payload
//    */
//   verifyRefreshToken(token: string): JwtPayload {
//     return this.jwtService.verifyToken(token); // You can use a different secret if you want
//   }

//   /**
//    * Generate only access token (useful for login + refresh)
//    */
//   generateAccessToken(payload: JwtPayload): string {
//     return this.jwtService.generateToken(payload, '15m');
//   }

//   /**
//    * Generate only refresh token
//    */
//   generateRefreshToken(payload: JwtPayload): string {
//     return this.jwtService.generateRefreshToken(payload);
//   }
// }