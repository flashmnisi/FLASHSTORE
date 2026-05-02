// apps/catalog-service/src/domain/value-objects/slug.vo.ts

export class Slug {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(name: string): Slug {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty to generate slug');
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars
      .replace(/\s+/g, '-')             // Replace spaces with hyphens
      .replace(/-+/g, '-')              // Remove multiple hyphens
      .replace(/^-|-$/g, '');           // Trim leading/trailing hyphens

    if (slug.length < 3) {
      throw new Error('Slug must be at least 3 characters long');
    }

    return new Slug(slug);
  }

  static fromString(slug: string): Slug {
    if (!slug || slug.trim().length < 3) {
      throw new Error('Invalid slug');
    }
    return new Slug(slug.toLowerCase().trim());
  }

  get value(): string {
    return this._value;
  }

  equals(other: Slug): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}