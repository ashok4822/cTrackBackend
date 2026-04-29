"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const AuthMapper_1 = require("../mappers/AuthMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class RefreshToken {
    userRepository;
    tokenService;
    configService;
    constructor(userRepository, tokenService, configService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.configService = configService;
    }
    async execute(refreshToken) {
        try {
            const decoded = this.tokenService.verify(refreshToken, this.configService.get("JWT_REFRESH_SECRET"));
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.UNAUTHORIZED);
            }
            const accessToken = this.tokenService.generate({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                companyName: user.companyName
            }, this.configService.get("JWT_ACCESS_SECRET"), this.configService.get("JWT_ACCESS_EXPIRY") || "15m");
            return AuthMapper_1.AuthMapper.toRefreshTokenResponseDto(accessToken);
        }
        catch (error) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_REFRESH_TOKEN, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
    }
}
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=RefreshToken.js.map