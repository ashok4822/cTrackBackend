import { UserRole } from "../dto/UserDto";
import { LoginResponseDto } from "../dto/AuthDto";

export interface IGoogleLogin {
  execute(
    code: string,
    requiredRole?: UserRole,
  ): Promise<LoginResponseDto>;
}
