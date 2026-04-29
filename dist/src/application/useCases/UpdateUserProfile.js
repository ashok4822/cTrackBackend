"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfile = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateUserProfile {
    userRepository;
    eventBus;
    constructor(userRepository, eventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }
    async execute(userId, data, userContext) {
        // Validation for name and phone (already present)
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 50) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_NAME_LENGTH, HttpStatus_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (data.phone !== undefined && data.phone !== "") {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(data.phone)) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_PHONE_FORMAT, HttpStatus_1.HttpStatus.BAD_REQUEST);
            }
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        // Create updated user via domain method
        const updatedUser = user.updateProfile({
            name: data.name,
            phone: data.phone,
            ...(data.hasOwnProperty('companyName') ? { companyName: data.companyName } : {})
        });
        await this.userRepository.save(updatedUser);
        // Log audit event
        const changes = [];
        if (data.name !== undefined)
            changes.push(`name: ${data.name}`);
        if (data.phone !== undefined)
            changes.push(`phone: ${data.phone}`);
        if (data.companyName !== undefined)
            changes.push(`companyName: ${data.companyName}`);
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_PROFILE_UPDATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_PROFILE,
            resourceId: userId,
            details: { changes },
            ipAddress: userContext.ipAddress
        });
        return UserMapper_1.UserMapper.toResponseDto(updatedUser);
    }
}
exports.UpdateUserProfile = UpdateUserProfile;
//# sourceMappingURL=UpdateUserProfile.js.map