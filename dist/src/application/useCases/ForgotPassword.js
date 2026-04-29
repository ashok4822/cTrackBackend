"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = void 0;
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class ForgotPassword {
    userRepository;
    otpRepository;
    emailService;
    constructor(userRepository, otpRepository, emailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }
    async execute(email) {
        const userExists = await this.userRepository.exists(email);
        if (!userExists) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.saveOtp(email, otp);
        await this.emailService.sendPasswordResetOtp(email, otp);
    }
}
exports.ForgotPassword = ForgotPassword;
//# sourceMappingURL=ForgotPassword.js.map