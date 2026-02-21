import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment, EquipmentStatus, EquipmentType } from "../../domain/entities/Equipment";

export class CreateEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(data: {
        name: string;
        type: EquipmentType;
        status: EquipmentStatus;
        operator?: string;
        lastMaintenance?: Date;
        nextMaintenance?: Date;
    }): Promise<Equipment> {
        const equipment = new Equipment(
            null as any,
            data.name,
            data.type,
            data.status,
            data.operator,
            data.lastMaintenance,
            data.nextMaintenance
        );
        return await this.equipmentRepository.save(equipment);
    }
}
