"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerHistoryHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
const ContainerHistory_1 = require("../../domain/entities/ContainerHistory");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class ContainerHistoryHandler {
    historyRepository;
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
        this.initialize();
    }
    initialize() {
        // Handle full container updates with automatic diffing for history
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CONTAINER_UPDATED, async (data) => {
            try {
                const { oldContainer, newContainer, performedBy, equipmentName } = data;
                const historyRecords = [];
                const logChange = (action, details) => {
                    historyRecords.push(new ContainerHistory_1.ContainerHistory(null, newContainer.id, action, details, performedBy));
                };
                // 1. Status Change
                if (newContainer.status !== oldContainer.status) {
                    logChange(ResponseMessage_1.ResponseMessage.ACTION_STATUS_CHANGED, `Status updated from ${oldContainer.status} to ${newContainer.status}`);
                }
                // 2. Location Change
                if (newContainer.yardLocation?.block !== oldContainer.yardLocation?.block) {
                    logChange(ResponseMessage_1.ResponseMessage.ACTION_LOCATION_UPDATED, `Location updated from ${oldContainer.yardLocation?.block || "None"} to ${newContainer.yardLocation?.block || "Gate"}`);
                    if (equipmentName) {
                        // This might trigger an EQUIPMENT_HISTORY_CREATED event in a more advanced setup, 
                        // but for now, we'll keep it simple or emit another event.
                        EventEmitterBus_1.eventBus.emit(IEventBus_1.DomainEvents.EQUIPMENT_HISTORY_CREATED, {
                            equipmentName, // Handler needs to find ID
                            action: ResponseMessage_1.ResponseMessage.ACTION_SHIFT_OPERATION,
                            details: `Shifted container ${newContainer.containerNumber} to ${newContainer.yardLocation?.block || "Unknown"}`,
                            performedBy
                        });
                    }
                }
                // 3. Weight Changes
                if (newContainer.weight !== oldContainer.weight) {
                    logChange(ResponseMessage_1.ResponseMessage.ACTION_WEIGHT_UPDATED, `Weight updated from ${oldContainer.weight || "None"} to ${newContainer.weight} kg`);
                }
                // 4. Seal Number
                if (newContainer.sealNumber !== oldContainer.sealNumber) {
                    logChange(ResponseMessage_1.ResponseMessage.ACTION_SEAL_NUMBER_UPDATED, `Seal number changed from ${oldContainer.sealNumber || "None"} to ${newContainer.sealNumber}`);
                }
                // 5. Damage Status
                if (newContainer.damaged !== oldContainer.damaged) {
                    logChange(ResponseMessage_1.ResponseMessage.ACTION_DAMAGE_STATUS_UPDATED, `Damage status changed to ${newContainer.damaged ? "Damaged" : "Undamaged"}`);
                }
                // Save all records
                for (const record of historyRecords) {
                    await this.historyRepository.save(record);
                }
            }
            catch (error) {
                console.error("[ContainerHistoryHandler] Failed to process CONTAINER_UPDATED:", error);
            }
        });
    }
}
exports.ContainerHistoryHandler = ContainerHistoryHandler;
//# sourceMappingURL=ContainerHistoryHandler.js.map