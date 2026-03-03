import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill, BillLineItem } from "../../domain/entities/Bill";
import { BillModel } from "../models/BillModel";
import { UserModel } from "../models/UserModel";
import mongoose from "mongoose";

export class BillRepository implements IBillRepository {
    async findAll(customerId?: string): Promise<Bill[]> {
        const query = customerId ? { customer: customerId } : {};
        const docs = await BillModel.find(query).sort({ createdAt: -1 }).lean();
        return this.mapWithCustomers(docs);
    }

    async findById(id: string): Promise<Bill | null> {
        const doc = await BillModel.findById(id).lean();
        if (!doc) return null;
        const [mapped] = await this.mapWithCustomers([doc]);
        return mapped;
    }

    async findByContainerId(containerId: string): Promise<Bill[]> {
        const docs = await BillModel.find({ containerId }).sort({ createdAt: -1 }).lean();
        return this.mapWithCustomers(docs);
    }

    async save(bill: Bill): Promise<Bill> {
        const doc = new BillModel({
            billNumber: bill.billNumber,
            containerNumber: bill.containerNumber,
            containerId: bill.containerId,
            shippingLine: bill.shippingLine,
            customer: bill.customer,
            lineItems: bill.lineItems,
            totalAmount: bill.totalAmount,
            status: bill.status,
            dueDate: bill.dueDate,
            remarks: bill.remarks,
        });
        const saved = await doc.save();
        const obj = saved.toObject();
        const [mapped] = await this.mapWithCustomers([obj]);
        return mapped;
    }

    async update(id: string, data: Partial<Bill>): Promise<Bill | null> {
        const doc = await BillModel.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!doc) return null;
        const [mapped] = await this.mapWithCustomers([doc]);
        return mapped;
    }

    // Helper to fetch user company names in bulk
    private async mapWithCustomers(docs: any[]): Promise<Bill[]> {
        if (!docs.length) return [];

        // Collect unique customer IDs
        const customerIds = [...new Set(docs.map(d => d.customer).filter(Boolean))];

        // Fetch users - only for valid ObjectIds if the field expects it
        let userMap: Record<string, string> = {};
        if (customerIds.length > 0) {
            // Filter valid ObjectIds to prevent casting errors
            const validObjectIds = customerIds.filter(id => mongoose.Types.ObjectId.isValid(id));

            if (validObjectIds.length > 0) {
                const users = await UserModel.find({ _id: { $in: validObjectIds } }).select('_id companyName name').lean();
                userMap = users.reduce((acc, u) => {
                    acc[u._id.toString()] = u.companyName || u.name || "Unknown Company";
                    return acc;
                }, {} as Record<string, string>);
            }
        }

        return docs.map(doc => this.mapToEntity(doc, userMap));
    }

    private mapToEntity(doc: any, userMap: Record<string, string> = {}): Bill {
        const { _id, __v, ...rest } = doc;
        return new Bill(
            _id.toString(),
            rest.billNumber,
            rest.containerNumber,
            rest.containerId?.toString() || "",
            rest.shippingLine,
            rest.customer || null,
            rest.customer ? userMap[rest.customer] : undefined,
            (rest.lineItems || []) as BillLineItem[],
            rest.totalAmount,
            rest.status,
            rest.dueDate,
            rest.remarks,
            rest.createdAt,
            rest.updatedAt
        );
    }
}
