"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDAController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class PDAController {
    getPDAUseCase;
    createRazorpayPDAOrderUseCase;
    verifyRazorpayPDAPaymentUseCase;
    constructor(getPDAUseCase, createRazorpayPDAOrderUseCase, verifyRazorpayPDAPaymentUseCase) {
        this.getPDAUseCase = getPDAUseCase;
        this.createRazorpayPDAOrderUseCase = createRazorpayPDAOrderUseCase;
        this.verifyRazorpayPDAPaymentUseCase = verifyRazorpayPDAPaymentUseCase;
    }
    getPDA = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const { id: userId, role } = req.user;
        const result = await this.getPDAUseCase.execute(userId, role);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result));
    });
    createRazorpayOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const { id: userId } = req.user;
        const { amount } = req.body;
        const result = await this.createRazorpayPDAOrderUseCase.execute(amount, userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result));
    });
    verifyRazorpayPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const { id: userId } = req.user;
        const { amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const result = await this.verifyRazorpayPDAPaymentUseCase.execute(userId, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result));
    });
}
exports.PDAController = PDAController;
//# sourceMappingURL=PDAController.js.map