import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService } from "../services/ITokenService";
import { IRefreshToken } from "../ports/IRefreshToken";
import { RefreshTokenResponseDto } from "../dto/AuthDto";
import { AuthMapper } from "../mappers/AuthMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class RefreshToken implements IRefreshToken {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
  ) { }

  async execute(refreshToken: string): Promise<RefreshTokenResponseDto> {
    try {
      const decoded = this._tokenService.verifyRefreshToken<{ id: string }>(
        refreshToken,
      );
      const user = await this._userRepository.findById(decoded.id);

      if (!user) {
        throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
      }

      const accessToken = this._tokenService.generateAccessToken(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          companyName: user.companyName
        },
      );

      return AuthMapper.toRefreshTokenResponseDto(accessToken);
    } catch {
      throw new AppError(ResponseMessage.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }
  }
}

