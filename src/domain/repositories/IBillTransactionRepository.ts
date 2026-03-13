import { BillTransaction } from "../entities/BillTransaction";

export interface IBillTransactionRepository {
    save(transaction: BillTransaction): Promise<BillTransaction>;
    findById(id: string): Promise<BillTransaction | null>;
    findByBillId(billId: string): Promise<BillTransaction[]>;
    findByOrderId(orderId: string): Promise<BillTransaction | null>;
    updateStatus(id: string, status: "success" | "failed", details?: { transactionId?: string; errorDetails?: string }): Promise<BillTransaction | null>;
}
