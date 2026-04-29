"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRazorpayPDAOrder = void 0;
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateRazorpayPDAOrder {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async execute(amount, userId) {
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.INVALID_AMOUNT}: ${amount}`, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const receipt = `pda_${userId.substring(userId.length - 10)}_${Date.now()}`;
        try {
            const order = await this.paymentService.createOrder(amount, receipt);
            return order;
        }
        catch (error) {
            console.error("[PDA] Razorpay Order Creation Error:", error);
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.PDA_ORDER_FAILED}: ${errorMessage}`, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.CreateRazorpayPDAOrder = CreateRazorpayPDAOrder;
//# sourceMappingURL=CreateRazorpayPDAOrder.js.map