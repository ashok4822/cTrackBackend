export type UserRole = "admin" | "operator" | "customer";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly password?: string,
    public readonly name?: string,
    public readonly phone?: string,
    public readonly googleId?: string,
    public readonly profileImage?: string,
    public readonly companyName?: string,
    public readonly isBlocked: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  updatePassword(hashedPassword: string): User {
    return new User(
      this.id,
      this.email,
      this.role,
      hashedPassword,
      this.name,
      this.phone,
      this.googleId,
      this.profileImage,
      this.companyName,
      this.isBlocked,
      this.createdAt,
      new Date(),
    );
  }

  updateProfile(data: { name?: string; phone?: string; profileImage?: string; companyName?: string }): User {
    return new User(
      this.id,
      this.email,
      this.role,
      this.password,
      data.name !== undefined ? data.name : this.name,
      data.phone !== undefined ? data.phone : this.phone,
      this.googleId,
      data.profileImage !== undefined ? data.profileImage : this.profileImage,
      data.companyName !== undefined ? data.companyName : this.companyName,
      this.isBlocked,
      this.createdAt,
      new Date(),
    );
  }
}
