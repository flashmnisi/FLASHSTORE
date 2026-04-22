export class OrderEntity {
  constructor(
    public readonly id: string,
    public userId: string,
    public items: any[],
    public totalAmount: number,
    public status: 'pending' | 'paid' | 'cancelled',
    public createdAt: Date = new Date()
  ) {}
}