import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService } from "../services/ITokenService";
import { IRefreshToken } from "../ports/IRefreshToken";
import { IConfigService } from "../services/IConfigService";
import { RefreshTokenResponseDto } from "../dto/AuthDto";
import { AuthMapper } from "../mappers/AuthMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class RefreshToken implements IRefreshToken {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private configService: IConfigService,
  ) { }

  async execute(refreshToken: string): Promise<RefreshTokenResponseDto> {
    try {
      const decoded = this.tokenService.verify<{ id: string }>(
        refreshToken,
        this.configService.get("JWT_REFRESH_SECRET"),
      );
      const user = await this.userRepository.findById(decoded.id);

      if (!user) {
        throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
      }

      const accessToken = this.tokenService.generate(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          companyName: user.companyName
        },
        this.configService.get("JWT_ACCESS_SECRET"),
        this.configService.get("JWT_ACCESS_EXPIRY") || "15m",
      );

      return AuthMapper.toRefreshTokenResponseDto(accessToken);
    } catch (error) {
      throw new AppError(ResponseMessage.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }
  }
}

