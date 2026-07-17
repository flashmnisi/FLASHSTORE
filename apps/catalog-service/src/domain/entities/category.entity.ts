// apps/catalog-service/src/domain/entities/category.entity.ts

export class CategoryEntity {
  constructor(
    public readonly id = '',

    private _name: string,
    private _slug: string,

    private _description?: string,
    private _parentId?: string,

    private _imageUrl?: string,
    private _icon?: string,

    private _isFeatured = false,
    private _sortOrder = 0,

    private _isActive = true,

    public readonly createdAt: Date = new Date(),
    private _updatedAt?: Date
  ) {}

  // =========================
  // GETTERS
  // =========================

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | undefined {
    return this._description;
  }

  get parentId(): string | undefined {
    return this._parentId;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  get icon(): string | undefined {
    return this._icon;
  }

  get isFeatured(): boolean {
    return this._isFeatured;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // =========================
  // METHODS
  // =========================

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  // =========================
  // SERIALIZATION
  // =========================

  toJSON() {
    return {
      id: this.id,
      name: this._name,
      slug: this._slug,
      description: this._description,
      parentId: this._parentId,
      imageUrl: this._imageUrl,
      icon: this._icon,
      isFeatured: this._isFeatured,
      sortOrder: this._sortOrder,
      isActive: this._isActive,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}