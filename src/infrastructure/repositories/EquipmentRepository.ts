import { IEquipmentRepository, EquipmentFilters } from "../../domain/repositories/IEquipmentRepository";
import { Equipment } from "../../domain/entities/Equipment";
import { EquipmentModel } from "../models/EquipmentModel";

export class EquipmentRepository implements IEquipmentRepository {
    async findAll(filter: EquipmentFilters = {}): Promise<Equipment[]> {
        const mongoFilter: any = {};
        if (filter.type) mongoFilter.type = filter.type;
        if (filter.status) mongoFilter.status = filter.status;
        if (filter.name) {
            mongoFilter.name = { $regex: filter.name, $options: "i" };
        }

        const equipment = await EquipmentModel.find(mongoFilter).sort({ createdAt: -1 });
        return equipment.map(this.toEntity);
    }

    async findById(id: string): Promise<Equipment | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        const equipment = await EquipmentModel.findById(id);
        if (!equipment) return null;
        return this.toEntity(equipment);
    }

    async save(equipment: Equipment): Promise<void> {
        const data = {
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            lastMaintenance: equipment.lastMaintenance,
            nextMaintenance: equipment.nextMaintenance,
            operator: equipment.operator,
        };

        if (equipment.id && equipment.id.match(/^[0-9a-fA-F]{24}$/)) {
            await EquipmentModel.findByIdAndUpdate(equipment.id, data);
        } else {
            const newEquipment = new EquipmentModel(data);
            await newEquipment.save();
        }
    }

    async delete(id: string): Promise<void> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return;
        await EquipmentModel.findByIdAndDelete(id);
    }

    private toEntity(doc: any): Equipment {
        return new Equipment(
            doc.id,
            doc.name,
            doc.type,
            doc.status,
            doc.lastMaintenance,
            doc.nextMaintenance,
            doc.operator,
            doc.createdAt,
            doc.updatedAt
        );
    }
}
