import { ICreateBlock } from "../ports/ICreateBlock";
import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { CreateBlockRequestDto, BlockResponseDto } from "../dto/YardDto";
import { UserContextDto } from "../dto/CommonDto";
import { YardMapper } from "../mappers/YardMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateBlock implements ICreateBlock {
    constructor(
        private readonly _blockRepository: IBlockRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(data: CreateBlockRequestDto, userContext: UserContextDto): Promise<BlockResponseDto> {
        if (!data.name || data.name.trim().length === 0) {
            throw new AppError(ResponseMessage.BLOCK_NAME_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        if (!data.capacity || data.capacity <= 0) {
            throw new AppError(ResponseMessage.INVALID_CAPACITY, HttpStatus.BAD_REQUEST);
        }

        const newBlock = YardMapper.toEntity(data);
        const savedBlock = await this._blockRepository.save(newBlock);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_BLOCK_CREATED,
            resourceType: ResponseMessage.RESOURCE_BLOCK,
            resourceId: savedBlock.id,
            details: { name: data.name, capacity: data.capacity },
            ipAddress: userContext.ipAddress
        });

        // Real-time yard update (Event-driven)
        this._eventBus.emit(DomainEvents.YARD_BLOCK_CREATED, { action: ResponseMessage.YARD_ACTION_CREATE, block: savedBlock });

        return YardMapper.toResponseDto(savedBlock);
    }
}

