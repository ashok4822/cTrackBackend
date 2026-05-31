export interface ITokenService {
  generateAccessToken<T extends object>(payload: T): string;
  generateRefreshToken<T extends object>(payload: T): string;
  verifyAccessToken<T extends object>(token: string): T;
  verifyRefreshToken<T extends object>(token: string): T;
}
