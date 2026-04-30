// apps/user-service/src/infrastructure/kafka/events/user.events.ts

/**
 * User Domain Events
 * Used for Outbox pattern and inter-service communication
 */

export const USER_EVENTS = {
  REGISTERED: 'user.registered',
  UPDATED: 'user.updated',
  DELETED: 'user.deleted',
  PASSWORD_RESET_REQUESTED: 'user.password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'user.password_reset_completed',
  LOGIN_SUCCESS: 'user.login.success',
  LOGOUT: 'user.logout',
} as const;

export type UserEventType = typeof USER_EVENTS[keyof typeof USER_EVENTS];

// Event Payload Types
export interface UserRegisteredEvent {
  userId: string;
  email: string;
  name: string;
  role: string;
  timestamp: string;
}

export interface UserUpdatedEvent {
  userId: string;
  email?: string;
  name?: string;
  updatedFields: string[];
  timestamp: string;
}

export interface PasswordResetRequestedEvent {
  userId: string;
  email: string;
  resetToken: string;   // Only for internal use, never expose publicly
  timestamp: string;
}

// Helper to create consistent event payloads
export const createUserEvent = <T>(
  eventType: UserEventType,
  data: T
) => ({
  event: eventType,
  data,
  timestamp: new Date().toISOString(),
  source: 'user-service' as const,
});