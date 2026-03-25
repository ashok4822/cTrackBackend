import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { BillTransaction } from "../../domain/entities/BillTransaction";
import { BillTransactionModel, IBillTransactionDocument } from "../models/BillTransactionModel";

export class BillTransactionRepository implements IBillTransactionRepository {
    private mapToEntity(doc: IBillTransactionDocument): BillTransaction {
        return new BillTransaction(
            doc._id.toString(),
            doc.billId.toString(),
            doc.userId.toString(),
            doc.amount,
            doc.method,
            doc.status,
            doc.transactionId,
            doc.orderId,
            doc.errorDetails,
            doc.timestamp,
            doc.createdAt,
            doc.updatedAt
        );
    }

    async save(transaction: BillTransaction): Promise<BillTransaction> {
        const data = {
            billId: transaction.billId,
            userId: transaction.userId,
            amount: transaction.amount,
            method: transaction.method,
            status: transaction.status,
            transactionId: transaction.transactionId,
            orderId: transaction.orderId,
            errorDetails: transaction.errorDetails,
            timestamp: transaction.timestamp,
        };

        let savedDoc;
        if (transaction.id) {
            savedDoc = await BillTransactionModel.findByIdAndUpdate(transaction.id, data, { new: true });
        } else {
            savedDoc = await BillTransactionModel.create(data);
        }

        if (!savedDoc) {
            throw new Error("Transaction not found");
        }
        return this.mapToEntity(savedDoc as IBillTransactionDocument);
    }

    async findById(id: string): Promise<BillTransaction | null> {
        const doc = await BillTransactionModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByBillId(billId: string): Promise<BillTransaction[]> {
        const docs = await BillTransactionModel.find({ billId }).sort({ timestamp: -1 });
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findByOrderId(orderId: string): Promise<BillTransaction | null> {
        const doc = await BillTransactionModel.findOne({ orderId });
        return doc ? this.mapToEntity(doc) : null;
    }

    async updateStatus(id: string, status: "success" | "failed", details?: { transactionId?: string; errorDetails?: string }): Promise<BillTransaction | null> {
        const doc = await BillTransactionModel.findByIdAndUpdate(
            id,
            { status, ...details },
            { new: true }
        );
        return doc ? this.mapToEntity(doc) : null;
    }
}
