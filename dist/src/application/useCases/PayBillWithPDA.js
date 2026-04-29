"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayBillWithPDA = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const BillingMapper_1 = require("../mappers/BillingMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class PayBillWithPDA {
    billRepository;
    pdaRepository;
    eventBus;
    notificationService;
    configService;
    transactionRepository;
    constructor(billRepository, pdaRepository, eventBus, notificationService, configService, transactionRepository) {
        this.billRepository = billRepository;
        this.pdaRepository = pdaRepository;
        this.eventBus = eventBus;
        this.notificationService = notificationService;
        this.configService = configService;
        this.transactionRepository = transactionRepository;
    }
    async execute(request, userContext) {
        const { billId, userId } = request;
        const bill = await this.billRepository.findById(billId);
        if (!bill) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (bill.customer !== userId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_OWNERSHIP_ERROR, HttpStatus_1.HttpStatus.FORBIDDEN);
        }
        if (bill.status === "paid") {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_ALREADY_PAID, HttpStatus_1.HttpStatus.CONFLICT);
        }
        const pda = await this.pdaRepository.findByUserId(userId);
        if (!pda) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.PDA_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        if (pda.balance < bill.totalAmount) {
            throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.PDA_INSUFFICIENT_BALANCE}. Available: ₹${pda.balance.toLocaleString()}, Bill Amount: ₹${bill.totalAmount.toLocaleString()}`, HttpStatus_1.HttpStatus.BAD_REQUEST);
        }
        // Deduct balance
        const newBalance = pda.balance - bill.totalAmount;
        await this.pdaRepository.updateBalance(pda.id, newBalance);
        // Create transaction record
        await this.pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "debit",
            amount: bill.totalAmount,
            description: `${ResponseMessage_1.ResponseMessage.ACTION_PROCESSED} Payment for Bill: ${bill.billNumber} (Container: ${bill.containerNumber})`,
            balanceAfter: newBalance,
            timestamp: new Date(),
        });
        // Update bill status
        const updatedBill = await this.billRepository.update(billId, {
            status: "paid",
            paidAt: new Date(),
            paymentMethod: "pda",
        });
        if (!updatedBill) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.BILL_STATUS_UPDATE_FAILED, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // Log bill transaction
        if (this.transactionRepository) {
            await this.transactionRepository.save(BillingMapper_1.BillingMapper.toTransactionEntity(billId, userId, bill.totalAmount, "pda", "success", `pda_${Date.now()}`));
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
                details: {
                    billNumber: updatedBill.billNumber,
                    totalAmount: updatedBill.totalAmount,
                    method: "PDA",
                },
                ipAddress: userContext.ipAddress,
            });
        }
        // Notify customer about successful payment via PDA
        try {
            await this.notificationService.send(userId, {
                type: "success",
                title: ResponseMessage_1.ResponseMessage.PAYMENT_SUCCESSFUL_PDA_TITLE,
                message: `${ResponseMessage_1.ResponseMessage.PDA_PAYMENT_PROCESSED_MESSAGE}. Bill: ${updatedBill.billNumber}, Amount: ₹${updatedBill.totalAmount.toLocaleString()}`,
                link: "/customer/bills",
            });
            // Check for low balance alert using centralized config
            const threshold = this.configService.getNumber('PDA_LOW_BALANCE_THRESHOLD');
            if (newBalance < threshold) {
                await this.notificationService.send(userId, {
                    type: "warning",
                    title: ResponseMessage_1.ResponseMessage.LOW_PDA_BALANCE_ALERT_TITLE,
                    message: `${ResponseMessage_1.ResponseMessage.LOW_PDA_BALANCE_MESSAGE} Current Balance: ₹${newBalance.toLocaleString()}`,
                    link: "/customer/pda",
                });
            }
        }
        catch (err) {
            console.error("Failed to create/emit notifications for PDA payment:", err);
        }
        return BillingMapper_1.BillingMapper.toResponseDto(updatedBill);
    }
}
exports.PayBillWithPDA = PayBillWithPDA;
//# sourceMappingURL=PayBillWithPDA.js.map