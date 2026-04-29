"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentHistoryHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
const EquipmentHistory_1 = require("../../domain/entities/EquipmentHistory");
class EquipmentHistoryHandler {
    historyRepository;
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
        this.initialize();
    }
    initialize() {
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.EQUIPMENT_HISTORY_CREATED, async (data) => {
            try {
                const history = new EquipmentHistory_1.EquipmentHistory(null, data.equipmentId || "Unknown", data.action, data.details, data.performedBy);
                await this.historyRepository.save(history);
            }
            catch (error) {
                console.error("[EquipmentHistoryHandler] Failed to save equipment history:", error);
            }
        });
    }
}
exports.EquipmentHistoryHandler = EquipmentHistoryHandler;
//# sourceMappingURL=EquipmentHistoryHandler.js.map