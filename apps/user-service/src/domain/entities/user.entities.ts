// apps/user-service/src/domain/entities/user.entity.ts

export class UserEntity {
  constructor(
    public readonly id: string = '',
    private _name: string,
    private _email: string,
    private _password: string,
    private _role: string = 'user',
    private _isAdmin: boolean = false,
    public readonly createdAt: Date = new Date(),
    private _updatedAt?: Date,
    private _addresses: any[] = [],
    private _phone?: string,
    private _refreshToken?: string
  ) {}

  // ======================
  // GETTERS
  // ======================
  get name() { return this._name; }
  get email() { return this._email; }
  get password() { return this._password; }
  get role() { return this._role; }
  get isAdmin() { return this._isAdmin; }
  get updatedAt() { return this._updatedAt; }
  get addresses() { return [...this._addresses]; }   // return copy for safety
  get phone() { return this._phone; }
  get refreshToken() { return this._refreshToken; }

  // ======================
  // DOMAIN METHODS
  // ======================
  updateProfile(data: { name?: string; email?: string; phone?: string }) {
    if (data.name) this._name = data.name;
    if (data.email) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    this._updatedAt = new Date();
  }

  changePassword(newHashedPassword: string) {
    this._password = newHashedPassword;
    this._updatedAt = new Date();
  }

  setRefreshToken(token: string) {
    this._refreshToken = token;
    this._updatedAt = new Date();
  }

  clearRefreshToken() {
    this._refreshToken = undefined;
    this._updatedAt = new Date();
  }

  makeAdmin() {
    this._role = 'admin';
    this._isAdmin = true;
    this._updatedAt = new Date();
  }

  // ======================
  // ADDRESS METHODS
  // ======================
  addAddress(address: any): void {
    this._addresses.push(address);
    this._updatedAt = new Date();
  }

  updateAddress(index: number, updatedAddress: any): void {
    if (index >= 0 && index < this._addresses.length) {
      this._addresses[index] = { ...this._addresses[index], ...updatedAddress };
      this._updatedAt = new Date();
    }
  }

  deleteAddress(index: number): void {
    if (index >= 0 && index < this._addresses.length) {
      this._addresses.splice(index, 1);
      this._updatedAt = new Date();
    }
  }

  // ======================
  // SERIALIZATION
  // ======================
  toJSON() {
    return {
      id: this.id,
      name: this._name,
      email: this._email,
      role: this._role,
      isAdmin: this._isAdmin,
      phone: this._phone,
      addresses: this._addresses,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
      // Never expose password or refreshToken
    };
  }
}