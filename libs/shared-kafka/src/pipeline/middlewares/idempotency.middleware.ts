import { idempotencyService } from "../../resilience/indempotency/idempotency.service";
import { EventMiddleware } from "../middleware";

export const idempotencyMiddleware: EventMiddleware = async (ctx, next) => {
  const exists = await idempotencyService.isDuplicate(
    ctx.eventId,
    ctx.serviceName
  );

  if (exists) return;

  await next();

  await idempotencyService.markAsProcessed(
    ctx.eventId,
    ctx.serviceName
  );
};