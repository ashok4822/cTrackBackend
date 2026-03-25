import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { Bill } from "../../domain/entities/Bill";
import { NotificationModel } from "../../infrastructure/models/NotificationModel";
import { socketService } from "../../infrastructure/services/socketService";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { BillTransaction } from "../../domain/entities/BillTransaction";
import { appConfig } from "../../infrastructure/config/appConfig";

export class PayBillWithPDA {
  constructor(
    private billRepository: IBillRepository,
    private pdaRepository: IPDARepository,
    private auditLogRepository?: IAuditLogRepository,
    private transactionRepository?: IBillTransactionRepository,
  ) {}

  async execute(
    billId: string,
    userId: string,
    userContext?: {
      userId: string;
      userName: string;
      userRole: string;
      ipAddress: string;
    },
  ): Promise<Bill> {
    const bill = await this.billRepository.findById(billId);
    if (!bill) {
      throw new Error("Bill not found");
    }

    if (bill.customer !== userId) {
      throw new Error("Unauthorized: This bill does not belong to you");
    }

    if (bill.status === "paid") {
      throw new Error("Bill is already paid");
    }

    const pda = await this.pdaRepository.findByUserId(userId);
    if (!pda) {
      throw new Error(
        "Pre-Deposit Account (PDA) not found. Please contact support.",
      );
    }

    if (pda.balance < bill.totalAmount) {
      throw new Error(
        `Insufficient balance in PDA. Available: ₹${pda.balance.toLocaleString()}, Bill Amount: ₹${bill.totalAmount.toLocaleString()}`,
      );
    }

    // Deduct balance
    const newBalance = pda.balance - bill.totalAmount;
    await this.pdaRepository.updateBalance(pda.id, newBalance);

    // Create transaction record
    await this.pdaRepository.createTransaction({
      pdaId: pda.id,
      type: "debit",
      amount: bill.totalAmount,
      description: `Payment for Bill: ${bill.billNumber} (Container: ${bill.containerNumber})`,
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
      throw new Error("Failed to update bill status");
    }

    // Log bill transaction
    if (this.transactionRepository) {
      await this.transactionRepository.save(
        new BillTransaction(
          null,
          billId,
          userId,
          bill.totalAmount,
          "pda",
          "success",
          `pda_${Date.now()}`,
        ),
      );
    }

    // Audit Log
    if (this.auditLogRepository && userContext) {
      await this.auditLogRepository.save(
        new AuditLog(
          null,
          userContext.userId,
          userContext.userRole,
          userContext.userName,
          "BILL_PAID",
          "Bill",
          updatedBill.id,
          JSON.stringify({
            billNumber: updatedBill.billNumber,
            totalAmount: updatedBill.totalAmount,
            method: "PDA",
          }),
          userContext.ipAddress,
        ),
      );
    }

    // Notify customer about successful payment via PDA
    try {
      const notification = await NotificationModel.create({
        userId: userId,
        type: "success",
        title: "Payment Successful (PDA)",
        message: `Your payment of ₹${updatedBill.totalAmount} for bill ${updatedBill.billNumber} has been processed using your PDA.`,
        link: "/customer/bills",
      });
      socketService.emitNotification({
        id: notification._id.toString(),
        type: "success",
        title: "Payment Successful (PDA)",
        message: `Your payment of ₹${updatedBill.totalAmount} for bill ${updatedBill.billNumber} has been processed using your PDA.`,
        link: "/customer/bills",
        read: false,
        timestamp: notification.createdAt || new Date(),
      }, userId);

      // Check for low balance alert using centralized config
      if (newBalance < appConfig.pda.lowBalanceThreshold) {
        const alertNotification = await NotificationModel.create({
          userId: userId,
          type: "alert",
          title: "Low PDA Balance Alert",
          message: `Your PDA balance is low: ₹${newBalance.toLocaleString()}. Please recharge to avoid payment delays.`,
          link: "/customer/pda",
        });
        socketService.emitNotification({
          id: alertNotification._id.toString(),
          type: "alert",
          title: "Low PDA Balance Alert",
          message: `Your PDA balance is low: ₹${newBalance.toLocaleString()}. Please recharge to avoid payment delays.`,
          link: "/customer/pda",
          read: false,
          timestamp: alertNotification.createdAt || new Date(),
        }, userId);
      }
    } catch (err) {
      console.error(
        "Failed to create/emit notifications for PDA payment:",
        err,
      );
    }

    return updatedBill;
  }
}
