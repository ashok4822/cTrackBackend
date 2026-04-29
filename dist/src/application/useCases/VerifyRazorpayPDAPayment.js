"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyRazorpayPDAPayment = void 0;
const PDAMapper_1 = require("../mappers/PDAMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class VerifyRazorpayPDAPayment {
    pdaRepository;
    paymentService;
    constructor(pdaRepository, paymentService) {
        this.pdaRepository = pdaRepository;
        this.paymentService = paymentService;
    }
    async execute(userId, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        // Verify signature
        const isValid = this.paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_PAYMENT_SIGNATURE, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const pda = await this.pdaRepository.findByUserId(userId);
        if (!pda)
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.PDA_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        const newBalance = pda.balance + amount;
        const transaction = await this.pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "credit",
            amount,
            description: `${ResponseMessage_1.ResponseMessage.ACTION_RAZORPAY_DEPOSIT} (${razorpay_payment_id})`,
            balanceAfter: newBalance,
            timestamp: new Date()
        });
        await this.pdaRepository.updateBalance(pda.id, newBalance);
        return PDAMapper_1.PDAMapper.toTransactionResponseDto(transaction);
    }
}
exports.VerifyRazorpayPDAPayment = VerifyRazorpayPDAPayment;
//# sourceMappingURL=VerifyRazorpayPDAPayment.js.map