export class CheckoutSagaEntity {
  public id: string = '';
  public userId: string;
  public orderId: string | null = null;
  public paymentId: string | null = null;
  public status: 'CREATED' | 'ORDER_CREATED' | 'PAYMENT_INITIATED' | 'PAYMENT_SUCCESS' | 'COMPLETED' | 'FAILED' = 'CREATED';
  public payload: any;
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
  public errorMessage?: string;

  constructor(userId: string, payload: any) {
    this.userId = userId;
    this.payload = payload;
  }

  // 🔥 ADD THIS
  static fromPersistence(data: Partial<CheckoutSagaEntity>): CheckoutSagaEntity {
    const entity = new CheckoutSagaEntity(
      data.userId!,
      data.payload
    );

    entity.id = data.id || '';
    entity.orderId = data.orderId ?? null;
    entity.paymentId = data.paymentId ?? null;
    entity.status = data.status || 'CREATED';
    entity.createdAt = data.createdAt || new Date();
    entity.updatedAt = data.updatedAt || new Date();
    entity.errorMessage = data.errorMessage;

    return entity;
  }

  markOrderCreated(orderId: string): void {
    this.orderId = orderId;
    this.status = 'ORDER_CREATED';
    this.updatedAt = new Date();
  }

  markPaymentInitiated(paymentId: string): void {
    this.paymentId = paymentId;
    this.status = 'PAYMENT_INITIATED';
    this.updatedAt = new Date();
  }

  markPaymentSuccess(): void {
    this.status = 'PAYMENT_SUCCESS';
    this.updatedAt = new Date();
  }

  complete(): void {
    this.status = 'COMPLETED';
    this.updatedAt = new Date();
  }

  fail(errorMessage: string): void {
    this.status = 'FAILED';
    this.errorMessage = errorMessage;
    this.updatedAt = new Date();
  }
}