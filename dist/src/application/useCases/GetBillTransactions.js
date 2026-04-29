"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBillTransactions = void 0;
const BillingMapper_1 = require("../mappers/BillingMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class GetBillTransactions {
    transactionRepository;
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(request, _userContext) {
        const { billId } = request;
        if (!billId)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_ID_REQUIRED, HttpStatus_1.HttpStatus.BAD_REQUEST);
        const transactions = await this.transactionRepository.findByBillId(billId);
        return BillingMapper_1.BillingMapper.toTransactionCollectionResponseDto(transactions);
    }
}
exports.GetBillTransactions = GetBillTransactions;
//# sourceMappingURL=GetBillTransactions.js.map