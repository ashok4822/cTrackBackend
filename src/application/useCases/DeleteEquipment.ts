import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { IDeleteEquipment } from "../ports/IDeleteEquipment";

export class DeleteEquipment implements IDeleteEquipment {
    constructor(private readonly _equipmentRepository: IEquipmentRepository) { }

    async execute(id: string): Promise<void> {
        await this._equipmentRepository.delete(id);
    }
}
