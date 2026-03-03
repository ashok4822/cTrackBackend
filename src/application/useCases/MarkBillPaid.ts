import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill } from "../../domain/entities/Bill";

export class MarkBillPaid {
    constructor(private billRepository: IBillRepository) { }

    async execute(id: string): Promise<Bill | null> {
        return this.billRepository.update(id, { status: "paid" } as Partial<Bill>);
    }
}
