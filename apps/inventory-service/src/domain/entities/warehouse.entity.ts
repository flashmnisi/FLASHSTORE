// apps/inventory-service/src/domain/entities/warehouse.entity.ts

export class WarehouseEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public address: string,
    public city: string,
    public country: string,
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateDetails(data: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
  }): void {
    if (data.name) this.name = data.name;
    if (data.address) this.address = data.address;
    if (data.city) this.city = data.city;
    if (data.country) this.country = data.country;

    this.updatedAt = new Date();
  }
}