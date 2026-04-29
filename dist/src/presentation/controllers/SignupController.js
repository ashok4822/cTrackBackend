"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class SignupController {
    initiateSignupUseCase;
    verifyOtpAndSignupUseCase;
    constructor(initiateSignupUseCase, verifyOtpAndSignupUseCase) {
        this.initiateSignupUseCase = initiateSignupUseCase;
        this.verifyOtpAndSignupUseCase = verifyOtpAndSignupUseCase;
    }
    initiateSignup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        await this.initiateSignupUseCase.execute(email);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.SIGNUP_INITIATED));
    });
    signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password, name, otp } = req.body;
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
        await this.verifyOtpAndSignupUseCase.execute({ email, otp, password, name, ipAddress });
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.SIGNUP_SUCCESS));
    });
}
exports.SignupController = SignupController;
//# sourceMappingURL=SignupController.js.map