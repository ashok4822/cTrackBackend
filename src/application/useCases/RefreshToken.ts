import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService } from "../services/ITokenService";

export class RefreshToken {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.tokenService.verify<{ id: string }>(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_fallback",
      );
      const user = await this.userRepository.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      const accessToken = this.tokenService.generate(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET || "access_fallback",
        "15m",
      );

      return { accessToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
