"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleUserBlockStatus = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class ToggleUserBlockStatus {
    userRepository;
    eventBus;
    constructor(userRepository, eventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }
    async execute(userId, userContext) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const updatedUser = UserMapper_1.UserMapper.applyBlockToggle(user);
        await this.userRepository.save(updatedUser);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: updatedUser.isBlocked ? ResponseMessage_1.ResponseMessage.USER_BLOCKED : ResponseMessage_1.ResponseMessage.USER_UNBLOCKED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_USER,
            resourceId: userId,
            details: { isBlocked: updatedUser.isBlocked, userEmail: user.email },
            ipAddress: userContext.ipAddress
        });
        return UserMapper_1.UserMapper.toResponseDto(updatedUser);
    }
}
exports.ToggleUserBlockStatus = ToggleUserBlockStatus;
//# sourceMappingURL=ToggleUserBlockStatus.js.map