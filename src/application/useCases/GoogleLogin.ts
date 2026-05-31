import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService } from "../services/ITokenService";
import { UserRole } from "../dto/UserDto";
import { IGoogleLogin } from "../ports/IGoogleLogin";
import { IAuthService } from "../services/IAuthService";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { LoginResponseDto } from "../dto/AuthDto";
import { AuthMapper } from "../mappers/AuthMapper";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";


export class GoogleLogin implements IGoogleLogin {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _authService: IAuthService,
    private readonly _eventBus: IEventBus
  ) { }

  async execute(
    code: string,
    requiredRole?: UserRole,
  ): Promise<LoginResponseDto> {
    const googleUser = await this._authService.verifyGoogleToken(code);
    const { email, googleId, name, profileImage } = googleUser;

    let user = await this._userRepository.findByGoogleId(googleId);

    if (!user) {
      //Check if user exists with the same email
      user = await this._userRepository.findByEmail(email);

      if (user) {
        // Link account if it matches email
        const updatedUser = UserMapper.linkGoogle(user, googleId, name, profileImage);
        await this._userRepository.save(updatedUser);
        user = updatedUser;
      } else {
        //Create new customer
        const newUser = UserMapper.createFromGoogle(email, googleId, name, profileImage);
        await this._userRepository.save(newUser);
        //Re-fetch to get the ID if it was created
        user = await this._userRepository.findByGoogleId(googleId);
      }
    }

    if (!user) {
      throw new AppError(ResponseMessage.GOOGLE_AUTH_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (user.isBlocked) {
      throw new AppError(ResponseMessage.USER_ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    // Role validation
    if (requiredRole && user.role !== requiredRole) {
      console.warn("GoogleLogin: Role mismatch", {
        requiredRole,
        userRole: user.role,
      });
      throw new AppError(ResponseMessage.UNAUTHORIZED_ROLE, HttpStatus.FORBIDDEN);
    }

    //Access token
    const accessToken = this._tokenService.generateAccessToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        companyName: user.companyName,
      },
    );

    // Refresh Token
    const refreshToken = this._tokenService.generateRefreshToken(
      { id: user.id },
    );

    // Event-driven Audit
    this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
      userId: user.id,
      userRole: user.role,
      userName: user.name || user.email,
      action: ResponseMessage.AUDIT_USER_LOGIN_GOOGLE,
      resourceType: ResponseMessage.RESOURCE_AUTH,
      resourceId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress: "oauth_provider"
    });

    return AuthMapper.toLoginResponseDto(user, accessToken, refreshToken);
  }
}

