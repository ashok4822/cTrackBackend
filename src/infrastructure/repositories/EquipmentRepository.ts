import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment } from "../../domain/entities/Equipment";
import { EquipmentModel } from "../models/EquipmentModel";

export class EquipmentRepository implements IEquipmentRepository {
    async findAll(filters?: {
        type?: string;
        status?: string;
        name?: string;
    }): Promise<Equipment[]> {
        const query: any = {};
        if (filters?.type) query.type = filters.type;
        if (filters?.status) query.status = filters.status;
        if (filters?.name) {
            query.name = { $regex: filters.name, $options: "i" };
        }

        const equipment = await EquipmentModel.find(query);
        return equipment.map(this.toEntity);
    }

    async findById(id: string): Promise<Equipment | null> {
        const equipment = await EquipmentModel.findById(id);
        if (!equipment) return null;
        return this.toEntity(equipment);
    }

    async save(equipment: Equipment): Promise<Equipment> {
        const data = {
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            operator: equipment.operator,
            lastMaintenance: equipment.lastMaintenance,
            nextMaintenance: equipment.nextMaintenance,
        };

        if (equipment.id && equipment.id.match(/^[0-9a-fA-F]{24}$/)) {
            const updated = await EquipmentModel.findByIdAndUpdate(
                equipment.id,
                data,
                { new: true }
            );
            return this.toEntity(updated);
        } else {
            const newEquipment = new EquipmentModel(data);
            const saved = await newEquipment.save();
            return this.toEntity(saved);
        }
    }

    async delete(id: string): Promise<void> {
        await EquipmentModel.findByIdAndDelete(id);
    }

    private toEntity(e: any): Equipment {
        return new Equipment(
            e.id,
            e.name,
            e.type,
            e.status,
            e.operator,
            e.lastMaintenance,
            e.nextMaintenance,
            e.createdAt,
            e.updatedAt
        );
    }
}
