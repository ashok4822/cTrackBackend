import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IMarkBillPaid } from "../ports/IMarkBillPaid";
import { BillResponseDto } from "../dto/BillingDto";
import { BillingMapper } from "../mappers/BillingMapper";

export class MarkBillPaid implements IMarkBillPaid {
    constructor(private billRepository: IBillRepository) { }

    async execute(id: string): Promise<BillResponseDto | null> {
        const bill = await this.billRepository.update(id, { status: "paid", paidAt: new Date() });
        return bill ? BillingMapper.toResponseDto(bill) : null;
    }
}
