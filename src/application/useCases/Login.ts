import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { ITokenService } from "../services/ITokenService";
import { ILogin } from "../ports/ILogin";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { AppError } from "../../domain/exceptions/AppError";
import { LoginRequestDto, LoginResponseDto } from "../dto/AuthDto";
import { AuthMapper } from "../mappers/AuthMapper";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class Login implements ILogin {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _hashService: IHashService,
    private readonly _tokenService: ITokenService,
    private readonly _eventBus: IEventBus
  ) { }


  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password, requiredRole, ipAddress } = request;
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw new AppError(ResponseMessage.USER_ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    if (!user.password) {
      throw new AppError(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this._hashService.compare(
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
    const accessToken = this._tokenService.generateAccessToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        companyName: user.companyName
      }
    );

    //Refresh Token (long-lived)
    const refreshToken = this._tokenService.generateRefreshToken(
      { id: user.id }
    );

    // Event-driven Audit
    if (ipAddress) {
      this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
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

