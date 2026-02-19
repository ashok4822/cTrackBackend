import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment } from "../../domain/entities/Equipment";

export class AddEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(equipmentData: Omit<Equipment, "id">): Promise<void> {
        const equipment = new Equipment(
            null,
            equipmentData.name,
            equipmentData.type,
            equipmentData.status,
            equipmentData.lastMaintenance,
            equipmentData.nextMaintenance,
            equipmentData.operator
        );
        await this.equipmentRepository.save(equipment);
    }
}
