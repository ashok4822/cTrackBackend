import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment } from "../../domain/entities/Equipment";

export class GetAllEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(filters?: {
        type?: string;
        status?: string;
        name?: string;
    }): Promise<Equipment[]> {
        return await this.equipmentRepository.findAll(filters);
    }
}
