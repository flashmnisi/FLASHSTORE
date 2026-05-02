// apps/catalog-service/src/domain/entities/category.entity.ts

export class CategoryEntity {
  constructor(
    public readonly id: string = '',
    private _name: string,
    private _slug: string,
    private _description?: string,
    private _parentId?: string,
    private _imageUrl?: string,
    private _isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    private _updatedAt?: Date
  ) {}

  get name(): string { return this._name; }
  get slug(): string { return this._slug; }
  get description(): string | undefined { return this._description; }
  get parentId(): string | undefined { return this._parentId; }
  get imageUrl(): string | undefined { return this._imageUrl; }
  get isActive(): boolean { return this._isActive; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  updateName(name: string): void {
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this._name,
      slug: this._slug,
      description: this._description,
      parentId: this._parentId,
      imageUrl: this._imageUrl,
      isActive: this._isActive,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}