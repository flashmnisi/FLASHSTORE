import { EventMiddleware } from "../middleware";

export const retryMiddleware: EventMiddleware = async (ctx, next) => {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      ctx.retryCount = i;
      await next();
      return;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
    }
  }
};