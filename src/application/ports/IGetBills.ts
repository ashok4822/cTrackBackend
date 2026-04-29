import { BillCollectionResponseDto, GetBillsRequestDto } from "../dto/BillingDto";

export interface IGetBills {
  execute(request: GetBillsRequestDto): Promise<BillCollectionResponseDto>;
}
