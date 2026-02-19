import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment } from "../../domain/entities/Equipment";

export class UpdateEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(id: string, equipmentData: Partial<Equipment>): Promise<void> {
        const existingEquipment = await this.equipmentRepository.findById(id);
        if (!existingEquipment) {
            throw new Error("Equipment not found");
        }

        const updatedEquipment = new Equipment(
            id,
            equipmentData.name ?? existingEquipment.name,
            equipmentData.type ?? existingEquipment.type,
            equipmentData.status ?? existingEquipment.status,
            equipmentData.lastMaintenance ?? existingEquipment.lastMaintenance,
            equipmentData.nextMaintenance ?? existingEquipment.nextMaintenance,
            equipmentData.operator ?? existingEquipment.operator
        );

        await this.equipmentRepository.save(updatedEquipment);
    }
}
