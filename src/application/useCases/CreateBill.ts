import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { ICreateBill } from "../ports/ICreateBill";
import { CreateBillRequestDto, BillResponseDto } from "../dto/BillingDto";
import { BillingMapper } from "../mappers/BillingMapper";

export class CreateBill implements ICreateBill {
    constructor(private readonly _billRepository: IBillRepository) { }

    async execute(data: CreateBillRequestDto): Promise<BillResponseDto> {
        const bill = BillingMapper.toEntity(data);

        const savedBill = await this._billRepository.save(bill);
        return BillingMapper.toResponseDto(savedBill);
    }
}
