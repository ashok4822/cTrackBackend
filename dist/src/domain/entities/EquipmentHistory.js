"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentHistory = void 0;
class EquipmentHistory {
    id;
    equipmentId;
    activity;
    details;
    performedBy;
    timestamp;
    createdAt;
    updatedAt;
    constructor(id, equipmentId, activity, details, performedBy, timestamp, createdAt, updatedAt) {
        this.id = id;
        this.equipmentId = equipmentId;
        this.activity = activity;
        this.details = details;
        this.performedBy = performedBy;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.EquipmentHistory = EquipmentHistory;
//# sourceMappingURL=EquipmentHistory.js.map