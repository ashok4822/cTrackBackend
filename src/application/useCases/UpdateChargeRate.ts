import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IUpdateChargeRate } from "../ports/IUpdateChargeRate";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { ChargeResponseDto, UpdateChargeRateRequestDto } from "../dto/ChargeDto";
import { ChargeMapper } from "../mappers/ChargeMapper";

export class UpdateChargeRate implements IUpdateChargeRate {
    constructor(
        private readonly _chargeRepository: IChargeRepository,
        private readonly _eventBus: IEventBus
    ) { }

    async execute(id: string, rateData: UpdateChargeRateRequestDto): Promise<ChargeResponseDto | null> {
        const currentCharge = await this._chargeRepository.findById(id);
        if (!currentCharge) return null;

        const updated = await this._chargeRepository.update(id, {
            rate: rateData.rate,
            effectiveFrom: rateData.effectiveFrom || new Date(),
            active: rateData.active !== undefined ? rateData.active : currentCharge.active
        });

        if (updated) {
            this._eventBus.emit(DomainEvents.CHARGE_HISTORY_CREATED, {
                chargeId: id,
                activityName: currentCharge.activityName || "Unknown",
                containerSize: currentCharge.containerSize,
                containerType: currentCharge.containerType,
                oldRate: currentCharge.rate,
                newRate: updated.rate,
                currency: currentCharge.currency,
                changedAt: new Date()
            });
            return ChargeMapper.toResponseDto(updated);
        }

        return null;
    }
}
