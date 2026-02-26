import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";

export class GetEquipmentHistory {
    constructor(private historyRepository: IEquipmentHistoryRepository) { }

    async execute(equipmentId: string): Promise<EquipmentHistory[]> {
        return await this.historyRepository.findByEquipmentId(equipmentId);
    }
}
