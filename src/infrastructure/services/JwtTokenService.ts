import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../application/services/ITokenService";

export class JwtTokenService implements ITokenService {
  generate<T extends object>(
    payload: T,
    secret: string,
    expiresIn: string,
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    });
  }

  verify<T extends object>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T;
  }
}
