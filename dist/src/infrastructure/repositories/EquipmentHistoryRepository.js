"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentHistoryRepository = void 0;
const EquipmentHistory_1 = require("../../domain/entities/EquipmentHistory");
const EquipmentHistoryModel_1 = require("../models/EquipmentHistoryModel");
class EquipmentHistoryRepository {
    async findByEquipmentId(equipmentId) {
        const histories = await EquipmentHistoryModel_1.EquipmentHistoryModel.find({ equipmentId }).sort({ timestamp: -1 });
        return histories.map(h => new EquipmentHistory_1.EquipmentHistory(h._id.toString(), h.equipmentId.toString(), h.activity, h.details, h.performedBy, h.timestamp, h.createdAt, h.updatedAt));
    }
    async save(history) {
        const historyData = {
            equipmentId: history.equipmentId,
            activity: history.activity,
            details: history.details,
            performedBy: history.performedBy,
            timestamp: history.timestamp || new Date()
        };
        if (history.id) {
            await EquipmentHistoryModel_1.EquipmentHistoryModel.findByIdAndUpdate(history.id, historyData);
        }
        else {
            await EquipmentHistoryModel_1.EquipmentHistoryModel.create(historyData);
        }
    }
}
exports.EquipmentHistoryRepository = EquipmentHistoryRepository;
//# sourceMappingURL=EquipmentHistoryRepository.js.map