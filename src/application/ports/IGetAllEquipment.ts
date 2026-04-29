import { EquipmentCollectionResponseDto, EquipmentFiltersDto } from "../dto/EquipmentDto";

export interface IGetAllEquipment {
    execute(filters?: EquipmentFiltersDto): Promise<EquipmentCollectionResponseDto>;
}
