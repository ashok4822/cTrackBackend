"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeHistoryHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
class ChargeHistoryHandler {
    historyRepository;
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
        this.initialize();
    }
    initialize() {
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CHARGE_HISTORY_CREATED, async (data) => {
            try {
                await this.historyRepository.save({
                    chargeId: data.chargeId,
                    activityName: data.activityName,
                    containerSize: data.containerSize,
                    containerType: data.containerType,
                    oldRate: data.oldRate,
                    newRate: data.newRate,
                    currency: data.currency,
                    changedAt: data.changedAt || new Date()
                });
            }
            catch (error) {
                console.error("[ChargeHistoryHandler] Failed to save charge history:", error);
            }
        });
    }
}
exports.ChargeHistoryHandler = ChargeHistoryHandler;
//# sourceMappingURL=ChargeHistoryHandler.js.map