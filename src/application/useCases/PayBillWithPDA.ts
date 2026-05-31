import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { IPayBillWithPDA } from "../ports/IPayBillWithPDA";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { INotificationService } from "../services/INotificationService";
import { IConfigService } from "../services/IConfigService";
import { BillResponseDto, PayBillWithPDARequestDto } from "../dto/BillingDto";
import { UserContextDto } from "../dto/CommonDto";
import { BillingMapper } from "../mappers/BillingMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class PayBillWithPDA implements IPayBillWithPDA {
  constructor(
    private readonly _billRepository: IBillRepository,
    private readonly _pdaRepository: IPDARepository,
    private readonly _eventBus: IEventBus,
    private readonly _notificationService: INotificationService,
    private readonly _configService: IConfigService,
    private readonly _transactionRepository?: IBillTransactionRepository,
  ) {}


  async execute(
    request: PayBillWithPDARequestDto,
    userContext?: UserContextDto,
  ): Promise<BillResponseDto> {
    const { billId, userId } = request;
    const bill = await this._billRepository.findById(billId);
    if (!bill) {
      throw new AppError(ResponseMessage.BILL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (bill.customer !== userId) {
      throw new AppError(ResponseMessage.BILL_OWNERSHIP_ERROR, HttpStatus.FORBIDDEN);
    }

    if (bill.status === "paid") {
      throw new AppError(ResponseMessage.BILL_ALREADY_PAID, HttpStatus.CONFLICT);
    }

    const pda = await this._pdaRepository.findByUserId(userId);
    if (!pda) {
      throw new AppError(
        ResponseMessage.PDA_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (pda.balance < bill.totalAmount) {
      throw new AppError(
        `${ResponseMessage.PDA_INSUFFICIENT_BALANCE}. Available: ₹${pda.balance.toLocaleString()}, Bill Amount: ₹${bill.totalAmount.toLocaleString()}`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Deduct balance
    const newBalance = pda.balance - bill.totalAmount;
    await this._pdaRepository.updateBalance(pda.id, newBalance);

    // Create transaction record
    await this._pdaRepository.createTransaction({
      pdaId: pda.id,
      type: "debit",
      amount: bill.totalAmount,
      description: `${ResponseMessage.ACTION_PROCESSED} Payment for Bill: ${bill.billNumber} (Container: ${bill.containerNumber})`,
      balanceAfter: newBalance,
      timestamp: new Date(),
    });

    // Update bill status
    const updatedBill = await this._billRepository.update(billId, {
      status: "paid",
      paidAt: new Date(),
      paymentMethod: "pda",
    });
    if (!updatedBill) {
      throw new AppError(ResponseMessage.BILL_STATUS_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Log bill transaction
    if (this._transactionRepository) {
      await this._transactionRepository.save(
        BillingMapper.toTransactionEntity(billId, userId, bill.totalAmount, "pda", "success", `pda_${Date.now()}`)
      );
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
      await this._notificationService.send(userId, {
        type: "success",
        title: ResponseMessage.PAYMENT_SUCCESSFUL_PDA_TITLE,
        message: `${ResponseMessage.PDA_PAYMENT_PROCESSED_MESSAGE}. Bill: ${updatedBill.billNumber}, Amount: ₹${updatedBill.totalAmount.toLocaleString()}`,
        link: "/customer/bills",
      });

      // Check for low balance alert using centralized config
      const threshold = this._configService.getNumber('PDA_LOW_BALANCE_THRESHOLD');
      if (newBalance < threshold) {
        await this._notificationService.send(userId, {
          type: "warning",
          title: ResponseMessage.LOW_PDA_BALANCE_ALERT_TITLE,
          message: `${ResponseMessage.LOW_PDA_BALANCE_MESSAGE} Current Balance: ₹${newBalance.toLocaleString()}`,
          link: "/customer/pda",
        });
      }
    } catch (err) {
      console.error(
        "Failed to create/emit notifications for PDA payment:",
        err,
      );
    }

    return BillingMapper.toResponseDto(updatedBill);
  }
}
