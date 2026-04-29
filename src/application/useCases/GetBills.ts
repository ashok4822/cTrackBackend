import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IGetBills } from "../ports/IGetBills";
import { BillCollectionResponseDto, GetBillsRequestDto } from "../dto/BillingDto";
import { BillingMapper } from "../mappers/BillingMapper";

export class GetBills implements IGetBills {
    constructor(private _billRepository: IBillRepository) { }

    async execute(request: GetBillsRequestDto): Promise<BillCollectionResponseDto> {
        const { customerId, status } = request;
        const bills = await this._billRepository.findAll(customerId, status);
        return BillingMapper.toCollectionResponseDto(bills);
    }
}
