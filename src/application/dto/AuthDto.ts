import type { UserRole } from "./UserDto";

export interface UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  profileImage?: string;
  isBlocked: boolean;
  companyName?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
  requiredRole?: UserRole;
  ipAddress?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
}

export interface SignupRequestDto {
  email: string;
  name?: string;
  phone?: string;
  companyName?: string;
}

export interface VerifyOtpAndSignupRequestDto {
  email: string;
  otp: string;
  password: string;
  name: string;
  ipAddress?: string;
}
