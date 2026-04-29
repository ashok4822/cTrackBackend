import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { IDeleteEquipment } from "../ports/IDeleteEquipment";

export class DeleteEquipment implements IDeleteEquipment {
    constructor(private equipmentRepository: IEquipmentRepository) { }

    async execute(id: string): Promise<void> {
        await this.equipmentRepository.delete(id);
    }
}
