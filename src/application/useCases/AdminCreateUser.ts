import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { IEmailService } from "../services/IEmailService";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import crypto from "crypto";

export interface UserContext {
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
}

export class AdminCreateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private emailService: IEmailService,
    private auditLogRepository: IAuditLogRepository,
  ) { }

  async execute(
    email: string,
    role: UserRole,
    userContext: UserContext,
    name?: string,
  ): Promise<User> {
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

    const savedUser = await this.userRepository.save(user);

    // Log audit event
    await this.auditLogRepository.save(new AuditLog(
      null,
      userContext.userId,
      userContext.userRole,
      userContext.userName,
      "USER_CREATED",
      "User",
      savedUser.id,
      JSON.stringify({ email, role, name }),
      userContext.ipAddress
    ));

    // Send welcome email with the generated password
    await this.emailService.sendWelcomeEmail(email, password, name);

    return savedUser;
  }
}
