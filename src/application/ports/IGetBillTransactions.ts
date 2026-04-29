import { BillTransactionCollectionResponseDto, GetBillTransactionsRequestDto } from "../dto/BillingDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IGetBillTransactions {
  execute(
    request: GetBillTransactionsRequestDto, 
    userContext: UserContextDto
  ): Promise<BillTransactionCollectionResponseDto>;
}
