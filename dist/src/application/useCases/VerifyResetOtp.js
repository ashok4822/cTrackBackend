"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyResetOtp = void 0;
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class VerifyResetOtp {
    otpRepository;
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    async execute(email, otp) {
        const savedOtpData = await this.otpRepository.findOtp(email);
        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_OTP, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;
        // 5 minute expiration (matching ResetPassword.ts)
        if (timeDifference > 300 * 1000) {
            await this.otpRepository.deleteOtp(email);
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.OTP_EXPIRED, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
    }
}
exports.VerifyResetOtp = VerifyResetOtp;
//# sourceMappingURL=VerifyResetOtp.js.map