"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnblacklistContainer = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UnblacklistContainer {
    containerRepository;
    eventBus;
    constructor(containerRepository, eventBus) {
        this.containerRepository = containerRepository;
        this.eventBus = eventBus;
    }
    async execute(id, userContext) {
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const updatedContainer = container.update({ blacklisted: false });
        await this.containerRepository.save(updatedContainer);
        this.eventBus.emit(IEventBus_1.DomainEvents.CONTAINER_HISTORY_CREATED, {
            containerId: id,
            action: ResponseMessage_1.ResponseMessage.ACTION_UNBLACKLISTED,
            details: ResponseMessage_1.ResponseMessage.DETAILS_UNBLACKLISTED,
            performedBy: userContext?.userName || "Admin"
        });
        // Audit Log (Event-driven)
        if (userContext) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage_1.ResponseMessage.AUDIT_UNBLACKLISTED,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_CONTAINER,
                resourceId: id,
                details: { containerNumber: updatedContainer.containerNumber },
                ipAddress: userContext.ipAddress
            });
        }
    }
}
exports.UnblacklistContainer = UnblacklistContainer;
//# sourceMappingURL=UnblacklistContainer.js.map