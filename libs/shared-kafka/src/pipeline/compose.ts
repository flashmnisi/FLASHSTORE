import { EventMiddleware, EventContext } from './middleware';

export class EventPipeline {
  private middlewares: EventMiddleware[] = [];

  use(mw: EventMiddleware) {
    this.middlewares.push(mw);
    return this;
  }

  async execute(
    ctx: EventContext,
    handler: (ctx: EventContext) => Promise<void>
  ) {
    let index = -1;

    const dispatch = async (): Promise<void> => {
      index++;

      if (index < this.middlewares.length) {
        const mw = this.middlewares[index];

        return mw(ctx, dispatch);
      }

      return handler(ctx);
    };

    await dispatch();
  }
}