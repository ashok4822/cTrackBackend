import { IUpdateShippingLine } from "../ports/IUpdateShippingLine";
import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UpdateShippingLineRequestDto, ShippingLineResponseDto } from "../dto/ShippingLineDto";
import { UserContextDto } from "../dto/CommonDto";
import { ShippingLineMapper } from "../mappers/ShippingLineMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateShippingLine implements IUpdateShippingLine {
    constructor(
        private readonly _shippingLineRepository: IShippingLineRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(id: string, data: UpdateShippingLineRequestDto, userContext: UserContextDto): Promise<ShippingLineResponseDto> {
        const shippingLine = await this._shippingLineRepository.findById(id);
        if (!shippingLine) {
            throw new AppError(ResponseMessage.SHIPPING_LINE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updatedShippingLine = ShippingLineMapper.applyUpdate(shippingLine, data);

        const saved = await this._shippingLineRepository.save(updatedShippingLine);

        const changes = [];
        if (data.name !== undefined) changes.push(`name: ${data.name}`);
        if (data.code !== undefined) changes.push(`code: ${data.code}`);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_SHIPPING_LINE_UPDATED,
            resourceType: ResponseMessage.RESOURCE_SHIPPING_LINE,
            resourceId: id,
            details: { changes },
            ipAddress: userContext.ipAddress
        });

        return ShippingLineMapper.toResponseDto(saved);
    }
}

