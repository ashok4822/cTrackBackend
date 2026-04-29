import { RefreshTokenResponseDto } from "../dto/AuthDto";

export interface IRefreshToken {
  execute(refreshToken: string): Promise<RefreshTokenResponseDto>;
}
