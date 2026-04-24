export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;

  constructor(
    private threshold = 5,
    private cooldown = 30_000
  ) {}

  async execute(fn: () => Promise<void>) {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      await fn();
      this.reset();
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  private isOpen() {
    return (
      this.failures >= this.threshold &&
      Date.now() - this.lastFailureTime < this.cooldown
    );
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
  }

  private reset() {
    this.failures = 0;
  }
}