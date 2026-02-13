export interface ITokenService {
  generate<T extends object>(
    payload: T,
    secret: string,
    expiresIn: string,
  ): string;
  verify<T extends object>(token: string, secret: string): T;
}
