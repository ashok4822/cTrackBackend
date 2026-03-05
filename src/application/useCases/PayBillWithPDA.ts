import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { Bill } from "../../domain/entities/Bill";
import { PDATransaction } from "../../domain/entities/PDA";

export class PayBillWithPDA {
    constructor(
        private billRepository: IBillRepository,
        private pdaRepository: IPDARepository
    ) { }

    async execute(billId: string, userId: string): Promise<Bill> {
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
            throw new Error("Pre-Deposit Account (PDA) not found. Please contact support.");
        }

        if (pda.balance < bill.totalAmount) {
            throw new Error(`Insufficient balance in PDA. Available: ₹${pda.balance.toLocaleString()}, Bill Amount: ₹${bill.totalAmount.toLocaleString()}`);
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
            timestamp: new Date()
        });

        // Update bill status
        const updatedBill = await this.billRepository.update(billId, { status: "paid" });
        if (!updatedBill) {
            throw new Error("Failed to update bill status");
        }

        return updatedBill;
    }
}
