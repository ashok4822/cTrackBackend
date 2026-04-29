"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class ResetPassword {
    userRepository;
    otpRepository;
    hashService;
    constructor(userRepository, otpRepository, hashService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.hashService = hashService;
    }
    async execute(email, otp, newPassword) {
        // Validation for new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_PASSWORD_FORMAT, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // 1. Verify OTP with strict expiration check
        const savedOtpData = await this.otpRepository.findOtp(email);
        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_OTP, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;
        // 5 minute expiration
        if (timeDifference > 300 * 1000) {
            await this.otpRepository.deleteOtp(email);
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.OTP_EXPIRED, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // 2. Find User
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        // 3. Hash New Password
        const hashedPassword = await this.hashService.hash(newPassword);
        // 4. Update User
        const updatedUser = user.updatePassword(hashedPassword);
        await this.userRepository.save(updatedUser);
        // 5. Cleanup OTP
        await this.otpRepository.deleteOtp(email);
    }
}
exports.ResetPassword = ResetPassword;
//# sourceMappingURL=ResetPassword.js.map