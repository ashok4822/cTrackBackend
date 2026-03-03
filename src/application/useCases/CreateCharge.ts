import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { Charge } from "../../domain/entities/Charge";

export class CreateCharge {
    constructor(private chargeRepository: IChargeRepository) { }

    async execute(chargeData: Charge): Promise<Charge> {
        const existing = await this.chargeRepository.findByCriteria(
            chargeData.activityId,
            chargeData.containerSize,
            chargeData.containerType
        );

        if (existing) {
            throw new Error(`Charge rate already exists for this activity (${chargeData.containerSize}, ${chargeData.containerType})`);
        }

        return this.chargeRepository.save(chargeData);
    }
}
