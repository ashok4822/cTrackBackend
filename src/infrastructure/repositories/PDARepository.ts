import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { PDA, PDATransaction } from "../../domain/entities/PDA";
import { PDAModel, PDATransactionModel } from "../models/PDAModel";

export class PDARepository implements IPDARepository {
    async findByUserId(userId: string): Promise<PDA | null> {
        const doc = await PDAModel.findOne({ userId });
        if (!doc) return null;
        return new PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated);
    }

    async findAll(): Promise<PDA[]> {
        const docs = await PDAModel.find().sort({ lastUpdated: -1 });
        return docs.map(doc => new PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated));
    }

    async create(pda: Partial<PDA>): Promise<PDA> {
        const doc = await PDAModel.create(pda);
        return new PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated);
    }

    async updateBalance(pdaId: string, balance: number): Promise<void> {
        await PDAModel.findByIdAndUpdate(pdaId, { balance, lastUpdated: new Date() });
    }

    async createTransaction(transaction: Partial<PDATransaction>): Promise<PDATransaction> {
        const doc = await PDATransactionModel.create(transaction);
        return new PDATransaction(
            doc._id.toString(),
            doc.pdaId.toString(),
            doc.type as "credit" | "debit",
            doc.amount,
            doc.description,
            doc.balanceAfter,
            doc.timestamp
        );
    }

    async findTransactionsByPdaId(pdaId: string): Promise<PDATransaction[]> {
        const docs = await PDATransactionModel.find({ pdaId }).sort({ timestamp: -1 });
        return docs.map(doc => new PDATransaction(
            doc._id.toString(),
            doc.pdaId.toString(),
            doc.type as "credit" | "debit",
            doc.amount,
            doc.description,
            doc.balanceAfter,
            doc.timestamp
        ));
    }

    async findOne(filter: Record<string, unknown>): Promise<PDA | null> {
        const doc = await PDAModel.findOne(filter);
        if (!doc) return null;
        return new PDA(doc._id.toString(), doc.userId.toString(), doc.customer, doc.balance, doc.lastUpdated);
    }
}
