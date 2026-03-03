import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";
import { ChargeHistory } from "../../domain/entities/ChargeHistory";

export class GetChargeHistory {
    constructor(private chargeHistoryRepository: IChargeHistoryRepository) { }

    async execute(): Promise<ChargeHistory[]> {
        return this.chargeHistoryRepository.findAll();
    }
}
