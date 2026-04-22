import { BaseEvent } from './base-event';

export interface UserRegisteredPayload {
  userId: string;
  email: string;
}

export type UserRegisteredEvent = BaseEvent<UserRegisteredPayload>;

export const createUserRegisteredEvent = (
  payload: UserRegisteredPayload,
  metadata?: BaseEvent['metadata']
): UserRegisteredEvent => ({
  event: 'user.registered',
  version: 1,
  timestamp: new Date().toISOString(),
  data: payload,
  metadata,
});