"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateUser = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class AdminUpdateUser {
    userRepository;
    eventBus;
    constructor(userRepository, eventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }
    async execute(userId, data) {
        const { userContext } = data;
        let nameToUse = undefined;
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 50) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_NAME_LENGTH, HttpStatus_1.HttpStatus.BAD_REQUEST);
            }
            nameToUse = trimmedName;
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        // Create updated user via mapper (using validated trimmed name)
        const updatedUser = UserMapper_1.UserMapper.applyAdminUpdate(user, { ...data, name: nameToUse });
        await this.userRepository.save(updatedUser);
        // Log audit event
        const changes = [];
        if (data.name !== undefined)
            changes.push(`name: ${data.name}`);
        if (data.role !== undefined)
            changes.push(`role: ${data.role}`);
        if (data.companyName !== undefined)
            changes.push(`companyName: ${data.companyName}`);
        if (data.isBlocked !== undefined)
            changes.push(`isBlocked: ${data.isBlocked}`);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_USER_UPDATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_USER,
            resourceId: userId,
            details: { changes },
            ipAddress: userContext.ipAddress
        });
        return UserMapper_1.UserMapper.toResponseDto(updatedUser);
    }
}
exports.AdminUpdateUser = AdminUpdateUser;
//# sourceMappingURL=AdminUpdateUser.js.map