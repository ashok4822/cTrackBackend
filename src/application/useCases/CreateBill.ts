import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill, BillLineItem } from "../../domain/entities/Bill";

export class CreateBill {
    constructor(private billRepository: IBillRepository) { }

    async execute(data: {
        containerNumber: string;
        containerId?: string;
        shippingLine?: string;
        customer: string | null;
        lineItems: BillLineItem[];
        totalAmount: number;
        remarks?: string;
        dueDate?: Date;
    }): Promise<Bill> {
        const billNumber = `BL-MISC-${Date.now().toString().slice(-6)}`;
        const bill = new Bill(
            null,
            billNumber,
            data.containerNumber,
            data.shippingLine || "N/A",
            data.containerId,
            data.customer,
            undefined,
            data.lineItems.map(item => ({
                ...item,
                amount: item.quantity * item.unitPrice
            })),
            data.totalAmount,
            "pending",
            data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            data.remarks,
            undefined, // paidAt
            new Date(), // createdAt
            new Date() // updatedAt
        );

        return await this.billRepository.save(bill);
    }
}
