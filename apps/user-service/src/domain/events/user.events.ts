export const USER_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGGED_IN: 'user.logged_in',
} as const;

export type UserEventType = typeof USER_EVENTS[keyof typeof USER_EVENTS];