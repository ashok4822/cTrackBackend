import { IUpdateBlock } from "../ports/IUpdateBlock";
import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UpdateBlockRequestDto, BlockResponseDto } from "../dto/YardDto";
import { UserContextDto } from "../dto/CommonDto";
import { YardMapper } from "../mappers/YardMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateBlock implements IUpdateBlock {
    constructor(
        private readonly _blockRepository: IBlockRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(id: string, data: UpdateBlockRequestDto, userContext: UserContextDto): Promise<BlockResponseDto> {
        const block = await this._blockRepository.findById(id);
        if (!block) {
            throw new AppError(ResponseMessage.BLOCK_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updatedBlock = YardMapper.applyUpdate(block, data);

        const savedBlock = await this._blockRepository.save(updatedBlock);

        const changes = [];
        if (data.name !== undefined) changes.push(`name: ${data.name}`);
        if (data.capacity !== undefined) changes.push(`capacity: ${data.capacity}`);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_BLOCK_UPDATED,
            resourceType: ResponseMessage.RESOURCE_BLOCK,
            resourceId: id,
            details: { changes },
            ipAddress: userContext.ipAddress
        });

        // Real-time yard update (Event-driven)
        this._eventBus.emit(DomainEvents.YARD_BLOCK_UPDATED, { action: ResponseMessage.YARD_ACTION_UPDATE, blockId: id, data });

        return YardMapper.toResponseDto(savedBlock);
    }
}

