import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { ICreateEquipment } from "../ports/ICreateEquipment";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { CreateEquipmentRequestDto, EquipmentResponseDto } from "../dto/EquipmentDto";
import { EquipmentMapper } from "../mappers/EquipmentMapper";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateEquipment implements ICreateEquipment {
    constructor(
        private readonly _equipmentRepository: IEquipmentRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(data: CreateEquipmentRequestDto, performedBy?: string): Promise<EquipmentResponseDto> {
        const equipment = EquipmentMapper.toEntity(data);
        const savedEquipment = await this._equipmentRepository.save(equipment);

        // Record History (Event-driven)
        if (savedEquipment.id) {
            this._eventBus.emit(DomainEvents.EQUIPMENT_HISTORY_CREATED, {
                equipmentId: savedEquipment.id,
                action: ResponseMessage.ACTION_CREATED,
                details: `${ResponseMessage.DETAILS_INITIALIZED}: ${data.name}`,
                performedBy: performedBy || "System"
            });
        }

        return EquipmentMapper.toResponseDto(savedEquipment);
    }
}
