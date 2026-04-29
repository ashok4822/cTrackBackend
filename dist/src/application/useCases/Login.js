"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const AppError_1 = require("../../domain/exceptions/AppError");
const AuthMapper_1 = require("../mappers/AuthMapper");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class Login {
    userRepository;
    hashService;
    tokenService;
    configService;
    eventBus;
    constructor(userRepository, hashService, tokenService, configService, eventBus) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.tokenService = tokenService;
        this.configService = configService;
        this.eventBus = eventBus;
    }
    async execute(request) {
        const { email, password, requiredRole, ipAddress } = request;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_CREDENTIALS, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        if (user.isBlocked) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_ACCOUNT_BLOCKED, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        if (!user.password) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_CREDENTIALS, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await this.hashService.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_CREDENTIALS, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        // Role check
        if (requiredRole && user.role !== requiredRole) {
            console.warn("LoginUseCase: Role mismatch", {
                requiredRole,
                userRole: user.role,
            });
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED_ROLE, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        //Access Token (short-lived)
        const accessToken = this.tokenService.generate({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            companyName: user.companyName
        }, this.configService.get("JWT_ACCESS_SECRET") || "access_fallback", this.configService.get("JWT_ACCESS_EXPIRY") || "15m");
        //Refresh Token (long-lived)
        const refreshToken = this.tokenService.generate({ id: user.id }, this.configService.get("JWT_REFRESH_SECRET") || "refresh_fallback", this.configService.get("JWT_REFRESH_EXPIRY") || "7d");
        // Event-driven Audit
        if (ipAddress) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: user.id,
                userRole: user.role,
                userName: user.name || user.email,
                action: ResponseMessage_1.ResponseMessage.AUDIT_USER_LOGIN,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_AUTH,
                resourceId: user.id,
                details: { email: user.email, role: user.role },
                ipAddress
            });
        }
        return AuthMapper_1.AuthMapper.toLoginResponseDto(user, accessToken, refreshToken);
    }
}
exports.Login = Login;
//# sourceMappingURL=Login.js.map