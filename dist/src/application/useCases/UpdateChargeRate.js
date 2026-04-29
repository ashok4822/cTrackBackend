"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChargeRate = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const ChargeMapper_1 = require("../mappers/ChargeMapper");
class UpdateChargeRate {
    chargeRepository;
    eventBus;
    constructor(chargeRepository, eventBus) {
        this.chargeRepository = chargeRepository;
        this.eventBus = eventBus;
    }
    async execute(id, rateData) {
        const currentCharge = await this.chargeRepository.findById(id);
        if (!currentCharge)
            return null;
        const updated = await this.chargeRepository.update(id, {
            rate: rateData.rate,
            effectiveFrom: rateData.effectiveFrom || new Date(),
            active: rateData.active !== undefined ? rateData.active : currentCharge.active
        });
        if (updated) {
            this.eventBus.emit(IEventBus_1.DomainEvents.CHARGE_HISTORY_CREATED, {
                chargeId: id,
                activityName: currentCharge.activityName || "Unknown",
                containerSize: currentCharge.containerSize,
                containerType: currentCharge.containerType,
                oldRate: currentCharge.rate,
                newRate: updated.rate,
                currency: currentCharge.currency,
                changedAt: new Date()
            });
            return ChargeMapper_1.ChargeMapper.toResponseDto(updated);
        }
        return null;
    }
}
exports.UpdateChargeRate = UpdateChargeRate;
//# sourceMappingURL=UpdateChargeRate.js.map