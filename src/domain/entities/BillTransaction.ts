export type TransactionStatus = "pending" | "success" | "failed";
export type PaymentMethod = "pda" | "online";

export class BillTransaction {
    constructor(
        public readonly id: string | null,
        public readonly billId: string,
        public readonly userId: string,
        public readonly amount: number,
        public readonly method: PaymentMethod,
        public readonly status: TransactionStatus,
        public readonly transactionId?: string,
        public readonly orderId?: string,
        public readonly errorDetails?: string,
        public readonly timestamp: Date = new Date(),
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
