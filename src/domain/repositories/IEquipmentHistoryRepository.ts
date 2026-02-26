import { EquipmentHistory } from "../entities/EquipmentHistory";

export interface IEquipmentHistoryRepository {
    findByEquipmentId(equipmentId: string): Promise<EquipmentHistory[]>;
    save(history: EquipmentHistory): Promise<void>;
}
