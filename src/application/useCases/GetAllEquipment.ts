import { IEquipmentRepository, EquipmentFilters } from "../../domain/repositories/IEquipmentRepository";
import { Equipment } from "../../domain/entities/Equipment";

export class GetAllEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(filter?: EquipmentFilters): Promise<Equipment[]> {
        return await this.equipmentRepository.findAll(filter);
    }
}
