import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment, EquipmentStatus, EquipmentType } from "../../domain/entities/Equipment";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";

export class UpdateEquipment {
    constructor(
        private equipmentRepository: IEquipmentRepository,
        private historyRepository: IEquipmentHistoryRepository
    ) { }

    async execute(
        id: string,
        data: Partial<{
            name: string;
            type: EquipmentType;
            status: EquipmentStatus;
            operator: string;
            lastMaintenance: Date;
            nextMaintenance: Date;
        }>,
        performedBy?: string
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

        const savedEquipment = await this.equipmentRepository.save(updatedEquipment);

        // Record History
        const historyDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

        await this.historyRepository.save(new EquipmentHistory(
            null,
            id,
            "Updated",
            historyDetails || "No changes specified",
            performedBy || "System"
        ));

        return savedEquipment;
    }
}
