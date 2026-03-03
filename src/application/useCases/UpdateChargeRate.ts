import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";
import { Charge } from "../../domain/entities/Charge";

export class UpdateChargeRate {
    constructor(
        private chargeRepository: IChargeRepository,
        private historyRepository: IChargeHistoryRepository
    ) { }

    async execute(id: string, rateData: { rate: number, effectiveFrom?: Date }): Promise<Charge | null> {
        const currentCharge = await this.chargeRepository.findById(id);
        if (!currentCharge) return null;

        const updated = await this.chargeRepository.update(id, {
            rate: rateData.rate,
            effectiveFrom: rateData.effectiveFrom || new Date()
        });

        if (updated) {
            await this.historyRepository.save({
                chargeId: id,
                activityName: currentCharge.activityName || "Unknown",
                containerSize: currentCharge.containerSize,
                containerType: currentCharge.containerType,
                oldRate: currentCharge.rate,
                newRate: updated.rate,
                currency: currentCharge.currency,
                changedAt: new Date()
            });
        }

        return updated;
    }
}
