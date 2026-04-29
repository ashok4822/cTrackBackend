"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShippingLine = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const ShippingLineMapper_1 = require("../mappers/ShippingLineMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateShippingLine {
    shippingLineRepository;
    eventBus;
    constructor(shippingLineRepository, eventBus) {
        this.shippingLineRepository = shippingLineRepository;
        this.eventBus = eventBus;
    }
    async execute(id, data, userContext) {
        const shippingLine = await this.shippingLineRepository.findById(id);
        if (!shippingLine) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.SHIPPING_LINE_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const updatedShippingLine = ShippingLineMapper_1.ShippingLineMapper.applyUpdate(shippingLine, data);
        const saved = await this.shippingLineRepository.save(updatedShippingLine);
        const changes = [];
        if (data.name !== undefined)
            changes.push(`name: ${data.name}`);
        if (data.code !== undefined)
            changes.push(`code: ${data.code}`);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_SHIPPING_LINE_UPDATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_SHIPPING_LINE,
            resourceId: id,
            details: { changes },
            ipAddress: userContext.ipAddress
        });
        return ShippingLineMapper_1.ShippingLineMapper.toResponseDto(saved);
    }
}
exports.UpdateShippingLine = UpdateShippingLine;
//# sourceMappingURL=UpdateShippingLine.js.map