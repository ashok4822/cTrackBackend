"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLogin = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const AuthMapper_1 = require("../mappers/AuthMapper");
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class GoogleLogin {
    userRepository;
    tokenService;
    authService;
    configService;
    eventBus;
    constructor(userRepository, tokenService, authService, configService, eventBus) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.authService = authService;
        this.configService = configService;
        this.eventBus = eventBus;
    }
    async execute(code, requiredRole) {
        const googleUser = await this.authService.verifyGoogleToken(code);
        const { email, googleId, name, profileImage } = googleUser;
        let user = await this.userRepository.findByGoogleId(googleId);
        if (!user) {
            //Check if user exists with the same email
            user = await this.userRepository.findByEmail(email);
            if (user) {
                // Link account if it matches email
                const updatedUser = UserMapper_1.UserMapper.linkGoogle(user, googleId, name, profileImage);
                await this.userRepository.save(updatedUser);
                user = updatedUser;
            }
            else {
                //Create new customer
                const newUser = UserMapper_1.UserMapper.createFromGoogle(email, googleId, name, profileImage);
                await this.userRepository.save(newUser);
                //Re-fetch to get the ID if it was created
                user = await this.userRepository.findByGoogleId(googleId);
            }
        }
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.GOOGLE_AUTH_FAILED, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (user.isBlocked) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_ACCOUNT_BLOCKED, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        // Role validation
        if (requiredRole && user.role !== requiredRole) {
            console.warn("GoogleLogin: Role mismatch", {
                requiredRole,
                userRole: user.role,
            });
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED_ROLE, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        //Access token
        const accessToken = this.tokenService.generate({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            companyName: user.companyName,
        }, this.configService.get("JWT_ACCESS_SECRET") || "access_fallback", this.configService.get("JWT_ACCESS_EXPIRY") || "15m");
        // Refresh Token
        const refreshToken = this.tokenService.generate({ id: user.id }, this.configService.get("JWT_REFRESH_SECRET") || "refresh_fallback", this.configService.get("JWT_REFRESH_EXPIRY") || "7d");
        // Event-driven Audit
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: user.id,
            userRole: user.role,
            userName: user.name || user.email,
            action: ResponseMessage_1.ResponseMessage.AUDIT_USER_LOGIN_GOOGLE,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_AUTH,
            resourceId: user.id,
            details: { email: user.email, role: user.role },
            ipAddress: "oauth_provider"
        });
        return AuthMapper_1.AuthMapper.toLoginResponseDto(user, accessToken, refreshToken);
    }
}
exports.GoogleLogin = GoogleLogin;
//# sourceMappingURL=GoogleLogin.js.map