"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRazorpayOrder = void 0;
const BillingMapper_1 = require("../mappers/BillingMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateRazorpayOrder {
    billRepository;
    transactionRepository;
    paymentService;
    constructor(billRepository, transactionRepository, paymentService) {
        this.billRepository = billRepository;
        this.transactionRepository = transactionRepository;
        this.paymentService = paymentService;
    }
    async execute(billId, userId) {
        const bill = await this.billRepository.findById(billId);
        if (!bill) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (!bill.customer || bill.customer.toString() !== userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_OWNERSHIP_ERROR, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        if (bill.status === "paid") {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_ALREADY_PAID, HttpStatus_1.HttpStatus.CONFLICT);
        }
        const receipt = `receipt_bill_${billId}`;
        try {
            const order = await this.paymentService.createOrder(bill.totalAmount, receipt);
            // Log pending transaction
            await this.transactionRepository.save(BillingMapper_1.BillingMapper.toTransactionEntity(billId, userId, bill.totalAmount, "online", "pending", undefined, order.id));
            return order;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.RAZORPAY_ORDER_FAILED}: ${errorMessage}`, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.CreateRazorpayOrder = CreateRazorpayOrder;
//# sourceMappingURL=CreateRazorpayOrder.js.map