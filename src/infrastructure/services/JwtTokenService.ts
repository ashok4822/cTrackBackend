import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";

export class JwtTokenService implements ITokenService {
  private readonly _accessSecret: string;
  private readonly _refreshSecret: string;
  private readonly _accessExpiry: string;
  private readonly _refreshExpiry: string;

  constructor(private readonly _configService: IConfigService) {
    this._accessSecret = this._configService.get("JWT_ACCESS_SECRET");
    this._refreshSecret = this._configService.get("JWT_REFRESH_SECRET");
    this._accessExpiry = this._configService.get("JWT_ACCESS_EXPIRY") || "15m";
    this._refreshExpiry = this._configService.get("JWT_REFRESH_EXPIRY") || "7d";
  }

  generateAccessToken<T extends object>(payload: T): string {
    return jwt.sign(payload, this._accessSecret, {
      expiresIn: this._accessExpiry as SignOptions["expiresIn"],
    });
  }

  generateRefreshToken<T extends object>(payload: T): string {
    return jwt.sign(payload, this._refreshSecret, {
      expiresIn: this._refreshExpiry as SignOptions["expiresIn"],
    });
  }

  verifyAccessToken<T extends object>(token: string): T {
    return jwt.verify(token, this._accessSecret) as T;
  }

  verifyRefreshToken<T extends object>(token: string): T {
    return jwt.verify(token, this._refreshSecret) as T;
  }
}
