// apps/user-service/src/infrastructure/kafka/events/auth.events.ts

/**
 * Authentication Related Events
 */

export const AUTH_EVENTS = {
  LOGIN_SUCCESS: 'auth.login.success',
  LOGIN_FAILED: 'auth.login.failed',
  LOGOUT: 'auth.logout',
  REFRESH_TOKEN_USED: 'auth.refresh_token.used',
  PASSWORD_RESET_INITIATED: 'auth.password_reset.initiated',
} as const;

export type AuthEventType = typeof AUTH_EVENTS[keyof typeof AUTH_EVENTS];

export interface LoginSuccessEvent {
  userId: string;
  email: string;
  timestamp: string;
}

export interface LogoutEvent {
  userId: string;
  timestamp: string;
}

// Helper
export const createAuthEvent = <T>(
  eventType: AuthEventType,
  data: T
) => ({
  event: eventType,
  data,
  timestamp: new Date().toISOString(),
  source: 'user-service' as const,
});