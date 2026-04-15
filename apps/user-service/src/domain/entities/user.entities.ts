export class UserEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,     // hashed
    public role: string = 'user',
    public isAdmin: boolean = false,
    public createdAt: Date = new Date(),
    public updatedAt?: Date
  ) {}
}