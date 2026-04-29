import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IGetBillById } from "../ports/IGetBillById";
import { BillResponseDto } from "../dto/BillingDto";
import { BillingMapper } from "../mappers/BillingMapper";

export class GetBillById implements IGetBillById {
    constructor(private billRepository: IBillRepository) { }

    async execute(id: string): Promise<BillResponseDto | null> {
        const bill = await this.billRepository.findById(id);
        return bill ? BillingMapper.toResponseDto(bill) : null;
    }
}
