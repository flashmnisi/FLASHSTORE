export type SagaStatus =
  | 'CREATED'
  | 'ORDER_CREATED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_SUCCESS'
  | 'COMPLETED'
  | 'FAILED';

export class CheckoutSagaEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public orderId: string | null,
    public paymentId: string | null,
    public status: SagaStatus,
    public payload: any,
    public error?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  markOrderCreated(orderId: string) {
    this.orderId = orderId;
    this.status = 'ORDER_CREATED';
    this.updatedAt = new Date();
  }

  markPaymentInitiated(paymentId: string) {
    this.paymentId = paymentId;
    this.status = 'PAYMENT_INITIATED';
    this.updatedAt = new Date();
  }

  markPaymentSuccess() {
    this.status = 'PAYMENT_SUCCESS';
    this.updatedAt = new Date();
  }

  complete() {
    this.status = 'COMPLETED';
    this.updatedAt = new Date();
  }

  fail(error: string) {
    this.status = 'FAILED';
    this.error = error;
    this.updatedAt = new Date();
  }
}