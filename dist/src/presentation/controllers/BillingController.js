"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
const userContext_1 = require("../utils/userContext");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class BillingController {
    getBillsUseCase;
    markBillPaidUseCase;
    createBillUseCase;
    payBillWithPDAUseCase;
    getBillByIdUseCase;
    createRazorpayOrderUseCase;
    verifyRazorpayPaymentUseCase;
    getBillTransactionsUseCase;
    getOverdueStatusUseCase;
    constructor(getBillsUseCase, markBillPaidUseCase, createBillUseCase, payBillWithPDAUseCase, getBillByIdUseCase, createRazorpayOrderUseCase, verifyRazorpayPaymentUseCase, getBillTransactionsUseCase, getOverdueStatusUseCase) {
        this.getBillsUseCase = getBillsUseCase;
        this.markBillPaidUseCase = markBillPaidUseCase;
        this.createBillUseCase = createBillUseCase;
        this.payBillWithPDAUseCase = payBillWithPDAUseCase;
        this.getBillByIdUseCase = getBillByIdUseCase;
        this.createRazorpayOrderUseCase = createRazorpayOrderUseCase;
        this.verifyRazorpayPaymentUseCase = verifyRazorpayPaymentUseCase;
        this.getBillTransactionsUseCase = getBillTransactionsUseCase;
        this.getOverdueStatusUseCase = getOverdueStatusUseCase;
    }
    getBills = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        let { customerId, status } = req.query;
        // If the user is a customer, they should only see their own bills
        if (req.user?.role === "customer") {
            customerId = req.user.id;
        }
        const bills = await this.getBillsUseCase.execute({
            customerId: customerId,
            status: status
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(bills));
    });
    markBillPaid = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updated = await this.markBillPaidUseCase.execute(id);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updated, ResponseMessage_1.ResponseMessage.BILL_PAID_SUCCESS));
    });
    createBill = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await this.createBillUseCase.execute(req.body);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(result, ResponseMessage_1.ResponseMessage.BILL_CREATED));
    });
    payWithPDA = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: billId } = req.params;
        const userId = req.user?.id;
        const userContext = req.user ? (0, userContext_1.extractUserContext)(req) : undefined;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const bill = await this.payBillWithPDAUseCase.execute({
            billId: billId,
            userId: userId
        }, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(bill, ResponseMessage_1.ResponseMessage.BILL_PAID_SUCCESS));
    });
    getBillById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const bill = await this.getBillByIdUseCase.execute(id);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(bill));
    });
    createRazorpayOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: billId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const order = await this.createRazorpayOrderUseCase.execute(billId, userId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(order));
    });
    verifyRazorpayPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: billId } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const userContext = req.user ? (0, userContext_1.extractUserContext)(req) : undefined;
        const bill = await this.verifyRazorpayPaymentUseCase.execute(billId, userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(bill, ResponseMessage_1.ResponseMessage.PAYMENT_VERIFIED));
    });
    getBillTransactions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: billId } = req.params;
        const user = req.user;
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const userContext = (0, userContext_1.extractUserContext)(req);
        const transactions = await this.getBillTransactionsUseCase.execute({
            billId: billId
        }, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(transactions));
    });
    getOverdueStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { customerId } = req.params;
        const isOverdue = await this.getOverdueStatusUseCase.execute(customerId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success({ isOverdue }));
    });
}
exports.BillingController = BillingController;
//# sourceMappingURL=BillingController.js.map