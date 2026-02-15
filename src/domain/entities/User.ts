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
  ) { }
}
