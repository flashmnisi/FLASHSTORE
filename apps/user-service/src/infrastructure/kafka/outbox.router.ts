import { EventPublisher } from './event.publisher';

const publisher = new EventPublisher();

export const outboxRouter = async (eventType: string, payload: any) => {
  const handlers: Record<string, Function> = {
    'user.registered': publisher.publishUserRegistered.bind(publisher),
    'user.logged_in': publisher.publishUserLoggedIn.bind(publisher),
  };

  const handler = handlers[eventType];

  if (!handler) {
    throw new Error(`No handler for event: ${eventType}`);
  }

  return handler(payload);
};