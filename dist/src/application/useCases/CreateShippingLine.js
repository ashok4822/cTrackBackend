"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShippingLine = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const ShippingLineMapper_1 = require("../mappers/ShippingLineMapper");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateShippingLine {
    shippingLineRepository;
    eventBus;
    constructor(shippingLineRepository, eventBus) {
        this.shippingLineRepository = shippingLineRepository;
        this.eventBus = eventBus;
    }
    async execute(data, userContext) {
        const shippingLine = ShippingLineMapper_1.ShippingLineMapper.toEntity(data);
        const savedShippingLine = await this.shippingLineRepository.save(shippingLine);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_SHIPPING_LINE_CREATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_SHIPPING_LINE,
            resourceId: savedShippingLine.id,
            details: { name: data.name, code: data.code },
            ipAddress: userContext.ipAddress
        });
        return ShippingLineMapper_1.ShippingLineMapper.toResponseDto(savedShippingLine);
    }
}
exports.CreateShippingLine = CreateShippingLine;
//# sourceMappingURL=CreateShippingLine.js.map