import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { IEmailService } from "../services/IEmailService";
import crypto from "crypto";

export class AdminCreateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private emailService: IEmailService,
  ) { }

  async execute(
    email: string,
    role: UserRole,
    name?: string,
  ): Promise<void> {
    // Business rule is that only admins can call this.
    // The controller/middleware handle the auth check.

    const userExists = await this.userRepository.exists(email);

    if (userExists) {
      throw new Error("User Already exists");
    }

    // Auto-generate a secure password
    const password = crypto.randomBytes(8).toString("hex");

    const hashedPassword = await this.hashService.hash(password);
    const user = new User("", email, role, hashedPassword, name, undefined, undefined, undefined);

    await this.userRepository.save(user);

    // Send welcome email with the generated password
    await this.emailService.sendWelcomeEmail(email, password, name);
  }
}
