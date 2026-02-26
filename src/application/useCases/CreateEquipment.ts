import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment, EquipmentStatus, EquipmentType } from "../../domain/entities/Equipment";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";

export class CreateEquipment {
    constructor(
        private equipmentRepository: IEquipmentRepository,
        private historyRepository: IEquipmentHistoryRepository
    ) { }

    async execute(data: {
        name: string;
        type: EquipmentType;
        status: EquipmentStatus;
        operator?: string;
        lastMaintenance?: Date;
        nextMaintenance?: Date;
    }, performedBy?: string): Promise<Equipment> {
        const equipment = new Equipment(
            null as any,
            data.name,
            data.type,
            data.status,
            data.operator,
            data.lastMaintenance,
            data.nextMaintenance
        );
        const savedEquipment = await this.equipmentRepository.save(equipment);

        // Record History
        if (savedEquipment.id) {
            await this.historyRepository.save(new EquipmentHistory(
                null,
                savedEquipment.id,
                "Created",
                `Equipment ${data.name} initialized with status ${data.status}`,
                performedBy || "System"
            ));
        }

        return savedEquipment;
    }
}
