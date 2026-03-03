import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { PDATransaction } from "../../domain/entities/PDA";

export class DepositFunds {
    constructor(private pdaRepository: IPDARepository) { }

    async execute(userId: string, amount: number, description: string): Promise<PDATransaction> {
        const pda = await this.pdaRepository.findByUserId(userId);
        if (!pda) throw new Error("PDA not found for user");

        const newBalance = pda.balance + amount;

        const transaction = await this.pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "credit",
            amount,
            description,
            balanceAfter: newBalance,
            timestamp: new Date()
        });

        await this.pdaRepository.updateBalance(pda.id, newBalance);

        return transaction;
    }
}
