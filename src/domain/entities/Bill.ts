export interface BillLineItem {
    activityCode: string;
    activityName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export class Bill {
    constructor(
        public readonly id: string | null,
        public readonly billNumber: string,
        public readonly containerNumber: string,
        public readonly shippingLine: string,
        public readonly containerId?: string,
        public readonly customer: string | null = null,
        public readonly customerName?: string,
        public readonly lineItems: BillLineItem[] = [],
        public readonly totalAmount: number = 0,
        public readonly status: "pending" | "paid" | "overdue" = "pending",
        public readonly dueDate: Date = new Date(),
        public readonly remarks?: string,
        public readonly paidAt?: Date,
        public readonly paymentMethod?: "pda" | "online",
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
