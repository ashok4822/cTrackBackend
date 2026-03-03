import { ChargeHistory } from "../entities/ChargeHistory";

export interface IChargeHistoryRepository {
    save(history: ChargeHistory): Promise<ChargeHistory>;
    findAll(): Promise<ChargeHistory[]>;
    findByChargeId(chargeId: string): Promise<ChargeHistory[]>;
}
