import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { UserRole } from "../../domain/entities/User";
import { ITokenService } from "../services/ITokenService";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

export class Login {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService,
    private auditLogRepository: IAuditLogRepository,
  ) { }

  async execute(
    email: string,
    password: string,
    requiredRole?: UserRole,
    ipAddress?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; role: UserRole; name?: string; profileImage?: string; isBlocked: boolean };
  }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.isBlocked) {
      throw new Error("Your account has been blocked. Please contact admin.");
    }

    if (!user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Role check
    console.log("LoginUseCase: Verifying role", {
      requiredRole,
      userRole: user.role,
    });
    if (requiredRole && user.role !== requiredRole) {
      console.warn("LoginUseCase: Role mismatch", {
        requiredRole,
        userRole: user.role,
      });
      throw new Error("Access denied: Unauthorized role for this portal");
    }

    //Access Token (short-lived)
    const accessToken = this.tokenService.generate(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_ACCESS_SECRET || "access_fallback",
      "15m",
    );

    //Refresh Token (long-lived)
    const refreshToken = this.tokenService.generate(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_fallback",
      "7d",
    );

    // Log successful login
    if (ipAddress) {
      await this.auditLogRepository.save(new AuditLog(
        null,
        user.id,
        user.role,
        user.name || user.email,
        "USER_LOGIN",
        "Auth",
        user.id,
        JSON.stringify({ email: user.email, role: user.role }),
        ipAddress
      ));
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profileImage: user.profileImage,
        isBlocked: user.isBlocked,
      },
    };
  }
}
