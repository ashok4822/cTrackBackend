"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpAndSignup = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const AppError_1 = require("../../domain/exceptions/AppError");
const UserMapper_1 = require("../mappers/UserMapper");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class VerifyOtpAndSignup {
    _userRepository;
    _otpRepository;
    _hashService;
    _eventBus;
    constructor(_userRepository, _otpRepository, _hashService, _eventBus) {
        this._userRepository = _userRepository;
        this._otpRepository = _otpRepository;
        this._hashService = _hashService;
        this._eventBus = _eventBus;
    }
    async execute(request) {
        const { email, otp, password, name, ipAddress } = request;
        // Validation for password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_PASSWORD_FORMAT, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const savedOtpData = await this._otpRepository.findOtp(email);
        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_OTP, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;
        if (timeDifference > 300 * 1000) { // 5 minutes in milliseconds
            await this._otpRepository.deleteOtp(email);
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.OTP_EXPIRED, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await this._hashService.hash(password);
        const user = UserMapper_1.UserMapper.createNew(email, "customer", hashedPassword, name);
        const savedUser = await this._userRepository.save(user);
        // Event-driven Audit
        if (ipAddress) {
            this._eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: savedUser.id,
                userRole: savedUser.role,
                userName: savedUser.name || savedUser.email,
                action: ResponseMessage_1.ResponseMessage.AUDIT_SIGNUP,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_USER,
                resourceId: savedUser.id,
                details: { email: savedUser.email },
                ipAddress
            });
        }
        await this._otpRepository.deleteOtp(email);
    }
}
exports.VerifyOtpAndSignup = VerifyOtpAndSignup;
//# sourceMappingURL=VerifyOtpAndSignup.js.map