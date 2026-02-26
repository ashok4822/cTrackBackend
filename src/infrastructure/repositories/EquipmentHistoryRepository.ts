import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";
import { EquipmentHistoryModel } from "../models/EquipmentHistoryModel";

export class EquipmentHistoryRepository implements IEquipmentHistoryRepository {
    async findByEquipmentId(equipmentId: string): Promise<EquipmentHistory[]> {
        const histories = await EquipmentHistoryModel.find({ equipmentId }).sort({ timestamp: -1 });
        return histories.map(h => new EquipmentHistory(
            h._id.toString(),
            h.equipmentId.toString(),
            h.activity,
            h.details,
            h.performedBy,
            h.timestamp,
            h.createdAt,
            h.updatedAt
        ));
    }

    async save(history: EquipmentHistory): Promise<void> {
        const historyData = {
            equipmentId: history.equipmentId,
            activity: history.activity,
            details: history.details,
            performedBy: history.performedBy,
            timestamp: history.timestamp || new Date()
        };

        if (history.id) {
            await EquipmentHistoryModel.findByIdAndUpdate(history.id, historyData);
        } else {
            await EquipmentHistoryModel.create(historyData);
        }
    }
}
