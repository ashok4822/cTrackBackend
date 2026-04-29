"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class PasswordController {
    forgotPasswordUseCase;
    resetPasswordUseCase;
    verifyResetOtpUseCase;
    constructor(forgotPasswordUseCase, resetPasswordUseCase, verifyResetOtpUseCase) {
        this.forgotPasswordUseCase = forgotPasswordUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.verifyResetOtpUseCase = verifyResetOtpUseCase;
    }
    forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        await this.forgotPasswordUseCase.execute(email);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.PASSWORD_RESET_OTP_SENT));
    });
    resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, otp, newPassword } = req.body;
        await this.resetPasswordUseCase.execute(email, otp, newPassword);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.PASSWORD_RESET_SUCCESS));
    });
    verifyResetOtp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, otp } = req.body;
        await this.verifyResetOtpUseCase.execute(email, otp);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.OTP_VERIFIED));
    });
}
exports.PasswordController = PasswordController;
//# sourceMappingURL=PasswordController.js.map