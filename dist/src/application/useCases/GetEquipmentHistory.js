"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEquipmentHistory = void 0;
const EquipmentMapper_1 = require("../mappers/EquipmentMapper");
class GetEquipmentHistory {
    historyRepository;
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async execute(equipmentId) {
        const historyList = await this.historyRepository.findByEquipmentId(equipmentId);
        return EquipmentMapper_1.EquipmentMapper.toHistoryCollectionResponseDto(historyList);
    }
}
exports.GetEquipmentHistory = GetEquipmentHistory;
//# sourceMappingURL=GetEquipmentHistory.js.map