//apps/notification-service/src/infrastructure/kafka/event.extractor.ts

export const extractEventData = (message: any) => {
  // handles multiple kafka wrapping styles safely

  if (!message) return {};

  // case 1: flat
  if (message.data && !message.data.data) {
    return message.data;
  }

  // case 2: double wrapped (your current issue)
  if (message.data?.data) {
    return message.data.data;
  }

  // fallback
  return message.data || {};
};