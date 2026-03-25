import { PDA, PDATransaction } from "../entities/PDA";

export interface IPDARepository {
    findByUserId(userId: string): Promise<PDA | null>;
    findAll(): Promise<PDA[]>;
    create(pda: Partial<PDA>): Promise<PDA>;
    updateBalance(pdaId: string, balance: number): Promise<void>;

    createTransaction(transaction: Partial<PDATransaction>): Promise<PDATransaction>;
    findTransactionsByPdaId(pdaId: string): Promise<PDATransaction[]>;
    findOne(filter: Record<string, unknown>): Promise<PDA | null>;
}
