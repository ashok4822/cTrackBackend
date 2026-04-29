import { EquipmentHistoryCollectionResponseDto } from "../dto/EquipmentDto";

export interface IGetEquipmentHistory {
    execute(equipmentId: string): Promise<EquipmentHistoryCollectionResponseDto>;
}
