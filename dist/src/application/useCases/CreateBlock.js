"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlock = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const YardMapper_1 = require("../mappers/YardMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateBlock {
    blockRepository;
    eventBus;
    constructor(blockRepository, eventBus) {
        this.blockRepository = blockRepository;
        this.eventBus = eventBus;
    }
    async execute(data, userContext) {
        if (!data.name || data.name.trim().length === 0) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BLOCK_NAME_REQUIRED, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        if (!data.capacity || data.capacity <= 0) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_CAPACITY, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const newBlock = YardMapper_1.YardMapper.toEntity(data);
        const savedBlock = await this.blockRepository.save(newBlock);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_BLOCK_CREATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_BLOCK,
            resourceId: savedBlock.id,
            details: { name: data.name, capacity: data.capacity },
            ipAddress: userContext.ipAddress
        });
        // Real-time yard update (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.YARD_BLOCK_CREATED, { action: ResponseMessage_1.ResponseMessage.YARD_ACTION_CREATE, block: savedBlock });
        return YardMapper_1.YardMapper.toResponseDto(savedBlock);
    }
}
exports.CreateBlock = CreateBlock;
//# sourceMappingURL=CreateBlock.js.map