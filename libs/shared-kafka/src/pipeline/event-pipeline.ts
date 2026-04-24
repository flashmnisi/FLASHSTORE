import { EventMiddleware, EventContext, Next } from "./middleware";

export class EventPipeline {
  private middlewares: EventMiddleware[] = [];

  /**
   * Register middleware
   */
  use(middleware: EventMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Execute pipeline
   */
  async execute(
    ctx: EventContext,
    finalHandler: (ctx: EventContext) => Promise<void>
  ): Promise<void> {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error('❌ next() called multiple times in middleware chain');
      }

      index = i;

      // If last middleware → run final handler
      if (i === this.middlewares.length) {
        return finalHandler(ctx);
      }

      const middleware = this.middlewares[i];

      const next: Next = async () => {
        await dispatch(i + 1);
      };

      await middleware(ctx, next);
    };

    await dispatch(0);
  }
}