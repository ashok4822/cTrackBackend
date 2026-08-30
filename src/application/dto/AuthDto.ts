import type { UserRole } from "./UserDto";

export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  name?: string;
  profileImage?: string;
  isBlocked!: boolean;
  companyName?: string;
}

export class LoginRequestDto {
  email!: string;
  password!: string;
  requiredRole?: UserRole;
  ipAddress?: string;
}

export class LoginResponseDto {
  accessToken!: string;
  refreshToken!: string;
  user!: UserResponseDto;
}

export class RefreshTokenResponseDto {
  accessToken!: string;
}

export class SignupRequestDto {
  email!: string;
  name?: string;
  phone?: string;
  companyName?: string;
}

export class VerifyOtpAndSignupRequestDto {
  email!: string;
  otp!: string;
  password!: string;
  name!: string;
  ipAddress?: string;
}
