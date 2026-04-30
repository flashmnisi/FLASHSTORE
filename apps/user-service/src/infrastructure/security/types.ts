// infrastructure/security/types.ts

export interface JwtPayload {
  sub: string;        // userId
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken extends JwtPayload {
  iat: number;
  exp: number;
}