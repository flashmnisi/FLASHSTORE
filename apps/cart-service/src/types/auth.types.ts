export type UserRole = 'user' | 'admin' | 'vendor';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}