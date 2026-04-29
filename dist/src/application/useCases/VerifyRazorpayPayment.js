"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyRazorpayPayment = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const BillingMapper_1 = require("../mappers/BillingMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class VerifyRazorpayPayment {
    billRepository;
    paymentService;
    notificationService;
    eventBus;
    transactionRepository;
    constructor(billRepository, paymentService, notificationService, eventBus, transactionRepository) {
        this.billRepository = billRepository;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.eventBus = eventBus;
        this.transactionRepository = transactionRepository;
    }
    async execute(billId, userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, userContext) {
        const bill = await this.billRepository.findById(billId);
        if (!bill) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (!bill.customer || bill.customer.toString() !== userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_OWNERSHIP_ERROR, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        // Verify signature
        const isValid = this.paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            // Log failed transaction
            if (this.transactionRepository) {
                const transaction = await this.transactionRepository.findByOrderId(razorpay_order_id);
                if (transaction && transaction.id) {
                    await this.transactionRepository.updateStatus(transaction.id, "failed", {
                        transactionId: razorpay_payment_id,
                        errorDetails: ResponseMessage_1.ResponseMessage.INVALID_PAYMENT_SIGNATURE
                    });
                }
            }
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.INVALID_PAYMENT_SIGNATURE, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Update bill status
        const updatedBill = await this.billRepository.update(billId, {
            status: "paid",
            paymentMethod: "online",
            paidAt: new Date()
        });
        if (!updatedBill) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_STATUS_UPDATE_FAILED, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // Update transaction to success
        if (this.transactionRepository) {
            const transaction = await this.transactionRepository.findByOrderId(razorpay_order_id);
            if (transaction && transaction.id) {
                await this.transactionRepository.updateStatus(transaction.id, "success", {
                    transactionId: razorpay_payment_id
                });
            }
        }
        // Audit Log (Event-driven)
        if (userContext) {
            this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage_1.ResponseMessage.AUDIT_BILL_PAID,
                resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_BILL,
                resourceId: updatedBill.id,
                details: { billNumber: updatedBill.billNumber, totalAmount: updatedBill.totalAmount, method: "Razorpay" },
                ipAddress: userContext.ipAddress
            });
        }
        // Notify customer about successful payment
        await this.notificationService.send(userId, {
            type: "success",
            title: ResponseMessage_1.ResponseMessage.PAYMENT_SUCCESSFUL_TITLE,
            message: `${ResponseMessage_1.ResponseMessage.PAYMENT_RECEIVED_MESSAGE} for bill ${updatedBill.billNumber}. Amount: ₹${updatedBill.totalAmount}`,
            link: "/customer/bills"
        });
        return BillingMapper_1.BillingMapper.toResponseDto(updatedBill);
    }
}
exports.VerifyRazorpayPayment = VerifyRazorpayPayment;
//# sourceMappingURL=VerifyRazorpayPayment.js.map