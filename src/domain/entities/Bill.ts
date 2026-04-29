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

    update(data: Partial<Bill>): Bill {
        return new Bill(
            this.id,
            data.billNumber !== undefined ? data.billNumber : this.billNumber,
            data.containerNumber !== undefined ? data.containerNumber : this.containerNumber,
            data.shippingLine !== undefined ? data.shippingLine : this.shippingLine,
            data.containerId !== undefined ? data.containerId : this.containerId,
            data.customer !== undefined ? data.customer : this.customer,
            this.customerName, // Preserve original name or let repo re-populate
            data.lineItems !== undefined ? data.lineItems : this.lineItems,
            data.totalAmount !== undefined ? data.totalAmount : this.totalAmount,
            data.status !== undefined ? data.status : this.status,
            data.dueDate !== undefined ? data.dueDate : this.dueDate,
            data.remarks !== undefined ? data.remarks : this.remarks,
            data.paidAt !== undefined ? data.paidAt : this.paidAt,
            data.paymentMethod !== undefined ? data.paymentMethod : this.paymentMethod,
            this.createdAt,
            new Date()
        );
    }
}
