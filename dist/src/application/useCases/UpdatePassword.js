"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePassword = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdatePassword {
    userRepository;
    hashService;
    eventBus;
    constructor(userRepository, hashService, eventBus) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.eventBus = eventBus;
    }
    async execute(userId, currentPassword, newPassword, confirmPassword, userContext) {
        // Validation for new password matching
        if (newPassword !== confirmPassword) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.PASSWORDS_DO_NOT_MATCH, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Validation for new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_PASSWORD_FORMAT, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        // Check if user has a password (not Google OAuth user)
        if (!user.password) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.OAUTH_USER_PASSWORD_ERROR, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Verify current password
        const isPasswordValid = await this.hashService.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INCORRECT_CURRENT_PASSWORD, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Hash new password
        const hashedPassword = await this.hashService.hash(newPassword);
        // Update user via domain method
        const updatedUser = user.updatePassword(hashedPassword);
        await this.userRepository.save(updatedUser);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_PASSWORD_UPDATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_PROFILE,
            resourceId: userId,
            details: { message: ResponseMessage_1.ResponseMessage.PASSWORD_UPDATE_SUCCESS },
            ipAddress: userContext.ipAddress
        });
    }
}
exports.UpdatePassword = UpdatePassword;
//# sourceMappingURL=UpdatePassword.js.map