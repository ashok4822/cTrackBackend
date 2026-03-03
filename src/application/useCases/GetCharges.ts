import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { Charge } from "../../domain/entities/Charge";

export class GetCharges {
    constructor(private chargeRepository: IChargeRepository) { }

    async execute(): Promise<Charge[]> {
        return this.chargeRepository.findAll();
    }
}
