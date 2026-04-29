"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentMapper = void 0;
const Equipment_1 = require("../../domain/entities/Equipment");
class EquipmentMapper {
    static toEntity(dto) {
        return new Equipment_1.Equipment(null, dto.name, dto.type, dto.status, dto.operator, dto.lastMaintenance, dto.nextMaintenance);
    }
    /** Apply an update to an existing Equipment entity */
    static applyUpdate(existing, data) {
        return new Equipment_1.Equipment(existing.id, data.name ?? existing.name, data.type ?? existing.type, data.status ?? existing.status, data.operator ?? existing.operator, data.lastMaintenance ?? existing.lastMaintenance, data.nextMaintenance ?? existing.nextMaintenance);
    }
    static toResponseDto(equipment) {
        return {
            id: equipment.id,
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            operator: equipment.operator,
            lastMaintenance: equipment.lastMaintenance,
            nextMaintenance: equipment.nextMaintenance,
            createdAt: equipment.createdAt,
            updatedAt: equipment.updatedAt,
        };
    }
    static toCollectionResponseDto(equipmentList) {
        return {
            items: equipmentList.map(e => this.toResponseDto(e)),
            total: equipmentList.length,
        };
    }
    static toHistoryResponseDto(history) {
        return {
            id: history.id,
            equipmentId: history.equipmentId,
            activity: history.activity,
            details: history.details ?? null,
            performedBy: history.performedBy ?? null,
            timestamp: history.timestamp ?? null,
        };
    }
    static toHistoryCollectionResponseDto(historyList) {
        return {
            items: historyList.map(h => this.toHistoryResponseDto(h)),
            total: historyList.length,
        };
    }
    static toSummaryDto(equipment) {
        return {
            id: equipment.id,
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
        };
    }
}
exports.EquipmentMapper = EquipmentMapper;
//# sourceMappingURL=EquipmentMapper.js.map