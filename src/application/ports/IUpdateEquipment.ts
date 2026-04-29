import { UpdateEquipmentRequestDto, EquipmentResponseDto } from "../dto/EquipmentDto";

export interface IUpdateEquipment {
    execute(
        id: string,
        data: UpdateEquipmentRequestDto,
        performedBy?: string
    ): Promise<EquipmentResponseDto>;
}
