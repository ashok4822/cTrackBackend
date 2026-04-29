"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlock = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const YardMapper_1 = require("../mappers/YardMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateBlock {
    _blockRepository;
    _eventBus;
    constructor(_blockRepository, _eventBus) {
        this._blockRepository = _blockRepository;
        this._eventBus = _eventBus;
    }
    async execute(id, data, userContext) {
        const block = await this._blockRepository.findById(id);
        if (!block) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BLOCK_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const updatedBlock = YardMapper_1.YardMapper.applyUpdate(block, data);
        const savedBlock = await this._blockRepository.save(updatedBlock);
        const changes = [];
        if (data.name !== undefined)
            changes.push(`name: ${data.name}`);
        if (data.capacity !== undefined)
            changes.push(`capacity: ${data.capacity}`);
        // Log audit event (Event-driven)
        this._eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_BLOCK_UPDATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_BLOCK,
            resourceId: id,
            details: { changes },
            ipAddress: userContext.ipAddress
        });
        // Real-time yard update (Event-driven)
        this._eventBus.emit(IEventBus_1.DomainEvents.YARD_BLOCK_UPDATED, { action: ResponseMessage_1.ResponseMessage.YARD_ACTION_UPDATE, blockId: id, data });
        return YardMapper_1.YardMapper.toResponseDto(savedBlock);
    }
}
exports.UpdateBlock = UpdateBlock;
//# sourceMappingURL=UpdateBlock.js.map