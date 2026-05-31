import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { IVerifyRazorpayPayment } from "../ports/IVerifyRazorpayPayment";
import { IPaymentService } from "../services/IPaymentService";
import { INotificationService } from "../services/INotificationService";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { BillResponseDto } from "../dto/BillingDto";
import { UserContextDto } from "../dto/CommonDto";
import { BillingMapper } from "../mappers/BillingMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class VerifyRazorpayPayment implements IVerifyRazorpayPayment {
    constructor(
        private readonly _billRepository: IBillRepository,
        private readonly _paymentService: IPaymentService,
        private readonly _notificationService: INotificationService,
        private readonly _eventBus: IEventBus,
        private readonly _transactionRepository?: IBillTransactionRepository
    ) { }


    async execute(
        billId: string,
        userId: string,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        userContext?: UserContextDto
    ): Promise<BillResponseDto> {
        const bill = await this._billRepository.findById(billId);

        if (!bill) {
            throw new AppError(ResponseMessage.BILL_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (!bill.customer || bill.customer.toString() !== userId) {
            throw new AppError(ResponseMessage.BILL_OWNERSHIP_ERROR, HttpStatus.FORBIDDEN);
        }

        // Verify signature
        const isValid = this._paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            // Log failed transaction
            if (this._transactionRepository) {
                const transaction = await this._transactionRepository.findByOrderId(razorpay_order_id);
                if (transaction && transaction.id) {
                    await this._transactionRepository.updateStatus(transaction.id, "failed", {
                        transactionId: razorpay_payment_id,
                        errorDetails: ResponseMessage.INVALID_PAYMENT_SIGNATURE
                    });
                }
            }
            throw new AppError(ResponseMessage.INVALID_PAYMENT_SIGNATURE, HttpStatus.BAD_REQUEST);
        }

        // Update bill status
        const updatedBill = await this._billRepository.update(billId, {
            status: "paid",
            paymentMethod: "online",
            paidAt: new Date()
        });

        if (!updatedBill) {
            throw new AppError(ResponseMessage.BILL_STATUS_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Update transaction to success
        if (this._transactionRepository) {
            const transaction = await this._transactionRepository.findByOrderId(razorpay_order_id);
            if (transaction && transaction.id) {
                await this._transactionRepository.updateStatus(transaction.id, "success", {
                    transactionId: razorpay_payment_id
                });
            }
        }

        // Audit Log (Event-driven)
        if (userContext) {
            this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
                userId: userContext.userId,
                userRole: userContext.userRole,
                userName: userContext.userName,
                action: ResponseMessage.AUDIT_BILL_PAID,
                resourceType: ResponseMessage.RESOURCE_BILL,
                resourceId: updatedBill.id,
                details: { billNumber: updatedBill.billNumber, totalAmount: updatedBill.totalAmount, method: "Razorpay" },
                ipAddress: userContext.ipAddress
            });
        }

        // Notify customer about successful payment
        await this._notificationService.send(userId, {
            type: "success",
            title: ResponseMessage.PAYMENT_SUCCESSFUL_TITLE,
            message: `${ResponseMessage.PAYMENT_RECEIVED_MESSAGE} for bill ${updatedBill.billNumber}. Amount: ₹${updatedBill.totalAmount}`,
            link: "/customer/bills"
        });

        return BillingMapper.toResponseDto(updatedBill);
    }
}
