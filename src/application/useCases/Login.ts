import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { UserRole } from "../../domain/entities/User";
import { ITokenService } from "../services/ITokenService";

export class Login {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; role: UserRole; name?: string };
  }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("INvalid credentials");
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    //Access Token (short-lived)
    const accessToken = this.tokenService.generate(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET || "access_fallback",
      "15m",
    );

    //Refresh Token (long-lived)
    const refreshToken = this.tokenService.generate(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_fallback",
      "7d",
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }
}
