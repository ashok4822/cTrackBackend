import { ICreateShippingLine } from "../ports/ICreateShippingLine";
import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { CreateShippingLineRequestDto, ShippingLineResponseDto } from "../dto/ShippingLineDto";
import { UserContextDto } from "../dto/CommonDto";
import { ShippingLineMapper } from "../mappers/ShippingLineMapper";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateShippingLine implements ICreateShippingLine {
    constructor(
        private readonly _shippingLineRepository: IShippingLineRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(data: CreateShippingLineRequestDto, userContext: UserContextDto): Promise<ShippingLineResponseDto> {
        const shippingLine = ShippingLineMapper.toEntity(data);
        const savedShippingLine = await this._shippingLineRepository.save(shippingLine);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_SHIPPING_LINE_CREATED,
            resourceType: ResponseMessage.RESOURCE_SHIPPING_LINE,
            resourceId: savedShippingLine.id,
            details: { name: data.name, code: data.code },
            ipAddress: userContext.ipAddress
        });

        return ShippingLineMapper.toResponseDto(savedShippingLine);
    }
}
