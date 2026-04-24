import { sendToDLQ } from "src/dlq/dlq.handler";
import { EventMiddleware } from "../middleware";

export const dlqMiddleware: EventMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    await sendToDLQ({
      topic: ctx.topic,
      message: ctx.event,
      error: err.message,
    });

    throw err;
  }
};