"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMapper = void 0;
class AuthMapper {
    static toUserResponseDto(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            profileImage: user.profileImage,
            isBlocked: user.isBlocked,
            companyName: user.companyName,
        };
    }
    static toLoginResponseDto(user, accessToken, refreshToken) {
        return {
            accessToken,
            refreshToken,
            user: this.toUserResponseDto(user),
        };
    }
    static toRefreshTokenResponseDto(accessToken) {
        return {
            accessToken,
        };
    }
}
exports.AuthMapper = AuthMapper;
//# sourceMappingURL=AuthMapper.js.map