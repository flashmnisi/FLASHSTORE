import { handleOrderCreated, handleOrderStatusUpdated } from "./order.handlers";

export const eventRouter = async (event: string, data: any) => {
  switch (event) {
    case 'order.created':
      return handleOrderCreated(data);

    case 'order.status.updated':
      return handleOrderStatusUpdated(data);

    default:
      throw new Error(`Unhandled event: ${event}`);
  }
};