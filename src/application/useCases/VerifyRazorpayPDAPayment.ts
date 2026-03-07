import crypto from "crypto";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { PDATransaction } from "../../domain/entities/PDA";

export class VerifyRazorpayPDAPayment {
    constructor(private pdaRepository: IPDARepository) { }

    async execute(
        userId: string,
        amount: number,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string
    ): Promise<PDATransaction> {
        // Verify signature
        const secret = process.env.RAZOR_SECRET_ID || "";
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature !== razorpay_signature) {
            throw new Error("Invalid payment signature");
        }

        const pda = await this.pdaRepository.findByUserId(userId);
        if (!pda) throw new Error("PDA not found for user");

        const newBalance = pda.balance + amount;

        const transaction = await this.pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "credit",
            amount,
            description: `Razorpay Deposit (${razorpay_payment_id})`,
            balanceAfter: newBalance,
            timestamp: new Date()
        });

        await this.pdaRepository.updateBalance(pda.id, newBalance);

        return transaction;
    }
}
