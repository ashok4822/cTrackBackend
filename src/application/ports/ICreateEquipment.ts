import { CreateEquipmentRequestDto, EquipmentResponseDto } from "../dto/EquipmentDto";

export interface ICreateEquipment {
    execute(
        data: CreateEquipmentRequestDto, 
        performedBy?: string
    ): Promise<EquipmentResponseDto>;
}
