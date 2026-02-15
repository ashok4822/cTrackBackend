import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";

export class AdminCreateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
  ) {}

  async execute(
    email: string,
    password: string,
    role: UserRole,
    name?: string,
  ): Promise<void> {
    // Note: Business rule could be that only admins can call this,
    // but the controller/middleware should handle the auth check.

    const userExists = await this.userRepository.exists(email);

    if (userExists) {
      throw new Error("User Already exists");
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = new User("", email, role, hashedPassword, name);

    await this.userRepository.save(user);
  }
}
