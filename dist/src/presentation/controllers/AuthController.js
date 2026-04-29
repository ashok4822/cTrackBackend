"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class AuthController {
    loginUseCase;
    refrershTokenUseCase;
    googleLoginUseCase;
    getUserProfileUseCase;
    constructor(loginUseCase, refrershTokenUseCase, googleLoginUseCase, getUserProfileUseCase) {
        this.loginUseCase = loginUseCase;
        this.refrershTokenUseCase = refrershTokenUseCase;
        this.googleLoginUseCase = googleLoginUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
    }
    getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const user = await this.getUserProfileUseCase.execute(userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(user));
    });
    googleLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { code, role } = req.body;
        const result = await this.googleLoginUseCase.execute(code, role);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success({
            accessToken: result.accessToken,
            user: result.user,
        }, ResponseMessage_1.ResponseMessage.LOGIN_SUCCESS));
    });
    login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password, role } = req.body;
        const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";
        const result = await this.loginUseCase.execute({ email, password, requiredRole: role, ipAddress });
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success({
            accessToken: result.accessToken,
            user: result.user,
        }, ResponseMessage_1.ResponseMessage.LOGIN_SUCCESS));
    });
    refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.TOKEN_MISSING, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const result = await this.refrershTokenUseCase.execute(refreshToken);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result));
    });
    logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.LOGOUT_SUCCESS));
    });
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map