import { IGetBillTransactions } from "../ports/IGetBillTransactions";
import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { BillTransactionCollectionResponseDto, GetBillTransactionsRequestDto } from "../dto/BillingDto";
import { BillingMapper } from "../mappers/BillingMapper";
import { UserContextDto } from "../dto/CommonDto";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class GetBillTransactions implements IGetBillTransactions {
    constructor(private readonly _transactionRepository: IBillTransactionRepository) {}

  async execute(
    request: GetBillTransactionsRequestDto,
    _userContext: UserContextDto
  ): Promise<BillTransactionCollectionResponseDto> {
    const { billId } = request;
    if (!billId) throw new AppError(ResponseMessage.BILL_ID_REQUIRED, HttpStatus.BAD_REQUEST);
    const transactions = await this._transactionRepository.findByBillId(billId);
    return BillingMapper.toTransactionCollectionResponseDto(transactions);
  }
}

