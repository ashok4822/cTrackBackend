import { User } from "../../domain/entities/User";
import { UserResponseDto, LoginResponseDto, RefreshTokenResponseDto } from "../dto/AuthDto";

export class AuthMapper {
  static toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      companyName: user.companyName,
    };
  }

  static toLoginResponseDto(user: User, accessToken: string, refreshToken: string): LoginResponseDto {
    return {
      accessToken,
      refreshToken,
      user: this.toUserResponseDto(user),
    };
  }

  static toRefreshTokenResponseDto(accessToken: string): RefreshTokenResponseDto {
    return {
      accessToken,
    };
  }
}
