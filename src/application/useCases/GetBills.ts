import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill } from "../../domain/entities/Bill";

export class GetBills {
    constructor(private billRepository: IBillRepository) { }

    async execute(customerId?: string): Promise<Bill[]> {
        return this.billRepository.findAll(customerId);
    }
}
