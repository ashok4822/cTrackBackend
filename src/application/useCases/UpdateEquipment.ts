import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment, EquipmentStatus, EquipmentType } from "../../domain/entities/Equipment";

export class UpdateEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(
        id: string,
        data: Partial<{
            name: string;
            type: EquipmentType;
            status: EquipmentStatus;
            operator: string;
            lastMaintenance: Date;
            nextMaintenance: Date;
        }>
    ): Promise<Equipment> {
        const existingEquipment = await this.equipmentRepository.findById(id);
        if (!existingEquipment) {
            throw new Error("Equipment not found");
        }

        const updatedEquipment = new Equipment(
            id,
            data.name ?? existingEquipment.name,
            data.type ?? existingEquipment.type,
            data.status ?? existingEquipment.status,
            data.operator ?? existingEquipment.operator,
            data.lastMaintenance ?? existingEquipment.lastMaintenance,
            data.nextMaintenance ?? existingEquipment.nextMaintenance
        );

        return await this.equipmentRepository.save(updatedEquipment);
    }
}
