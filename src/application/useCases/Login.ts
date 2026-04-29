import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { ITokenService } from "../services/ITokenService";
import { ILogin } from "../ports/ILogin";
import { IConfigService } from "../services/IConfigService";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { AppError } from "../../domain/exceptions/AppError";
import { LoginRequestDto, LoginResponseDto } from "../dto/AuthDto";
import { AuthMapper } from "../mappers/AuthMapper";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class Login implements ILogin {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService,
    private configService: IConfigService,
    private eventBus: IEventBus
  ) { }


  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password, requiredRole, ipAddress } = request;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw new AppError(ResponseMessage.USER_ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    if (!user.password) {
      throw new AppError(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    // Role check
    if (requiredRole && user.role !== requiredRole) {
      console.warn("LoginUseCase: Role mismatch", {
        requiredRole,
        userRole: user.role,
      });
      throw new AppError(ResponseMessage.UNAUTHORIZED_ROLE, HttpStatus.FORBIDDEN);
    }

    //Access Token (short-lived)
    const accessToken = this.tokenService.generate(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        companyName: user.companyName
      },
      this.configService.get("JWT_ACCESS_SECRET") || "access_fallback",
      this.configService.get("JWT_ACCESS_EXPIRY") || "15m",
    );

    //Refresh Token (long-lived)
    const refreshToken = this.tokenService.generate(
      { id: user.id },
      this.configService.get("JWT_REFRESH_SECRET") || "refresh_fallback",
      this.configService.get("JWT_REFRESH_EXPIRY") || "7d",
    );

    // Event-driven Audit
    if (ipAddress) {
      this.eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
        userId: user.id,
        userRole: user.role,
        userName: user.name || user.email,
        action: ResponseMessage.AUDIT_USER_LOGIN,
        resourceType: ResponseMessage.RESOURCE_AUTH,
        resourceId: user.id,
        details: { email: user.email, role: user.role },
        ipAddress
      });
    }

    return AuthMapper.toLoginResponseDto(user, accessToken, refreshToken);
  }
}

