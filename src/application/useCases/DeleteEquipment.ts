import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";

export class DeleteEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(id: string): Promise<void> {
        await this.equipmentRepository.delete(id);
    }
}
