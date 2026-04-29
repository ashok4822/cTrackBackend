"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContainer = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateContainer {
    containerRepository;
    equipmentRepository;
    blockRepository;
    eventBus;
    constructor(containerRepository, equipmentRepository, blockRepository, eventBus) {
        this.containerRepository = containerRepository;
        this.equipmentRepository = equipmentRepository;
        this.blockRepository = blockRepository;
        this.eventBus = eventBus;
    }
    async execute(request, userContext) {
        const { id, equipmentName, performedBy = "System", ...data } = request;
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        // 1. Yard Assignment Validation (Guard)
        if (data.yardLocation && data.yardLocation.block !== container.yardLocation?.block) {
            const allowedStatuses = ["gate-in", "in-yard", "damaged"];
            if (!allowedStatuses.includes(container.status)) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_OUTSIDE_TERMINAL, HttpStatus_1.HttpStatus.BAD_REQUEST);
            }
            if (data.yardLocation.block) {
                const newBlock = await this.blockRepository.findByName(data.yardLocation.block);
                if (!newBlock) {
                    throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BLOCK_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
                }
                if (newBlock.occupied >= newBlock.capacity) {
                    throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BLOCK_FULL, HttpStatus_1.HttpStatus.BAD_REQUEST);
                }
            }
        }
        // 2. Perform Primary State Update
        const updatedContainer = container.update(data);
        await this.containerRepository.save(updatedContainer);
        // Domain side-effects
        this.eventBus.emit(IEventBus_1.DomainEvents.CONTAINER_UPDATED, {
            oldContainer: container,
            newContainer: updatedContainer,
            performedBy,
            equipmentName,
            userContext // pass userContext for audit logging in the handler if needed, or keep audit log here
        });
        // Audit Log (Keep here as it's a primary responsibility of the Use Case to log what happened)
        if (userContext) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage_1.ResponseMessage.AUDIT_CONTAINER_UPDATED,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_CONTAINER,
                resourceId: updatedContainer.id,
                details: { containerNumber: updatedContainer.containerNumber },
                ipAddress: userContext.ipAddress
            });
        }
    }
}
exports.UpdateContainer = UpdateContainer;
//# sourceMappingURL=UpdateContainer.js.map