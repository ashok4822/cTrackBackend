import { IBillRepository, BillAggregateFilter, BillAggregateResult } from "../../domain/repositories/IBillRepository";
import { Bill, BillLineItem } from "../../domain/entities/Bill";
import { BillModel } from "../models/BillModel";
import { UserModel } from "../models/UserModel";
import mongoose from "mongoose";

interface BillLeanDoc {
  _id: mongoose.Types.ObjectId;
  billNumber?: string;
  containerNumber?: string;
  shippingLine?: string;
  containerId?: mongoose.Types.ObjectId;
  customer?: string;
  lineItems?: BillLineItem[];
  totalAmount?: number;
  status?: "pending" | "paid" | "overdue";
  dueDate?: Date;
  remarks?: string;
  paidAt?: Date;
  paymentMethod?: "pda" | "online";
  createdAt?: Date;
  updatedAt?: Date;
}

export class BillRepository implements IBillRepository {
  async findAll(customerId?: string): Promise<Bill[]> {
    const query = customerId ? { customer: customerId } : {};
    const docs = await BillModel.find(query).sort({ createdAt: -1 }).lean();
    return this.mapWithCustomers(docs as BillLeanDoc[]);
  }

  async findById(id: string): Promise<Bill | null> {
    const doc = await BillModel.findById(id).lean();
    if (!doc) return null;
    const [mapped] = await this.mapWithCustomers([doc as BillLeanDoc]);
    return mapped;
  }

  async findByContainerId(containerId: string): Promise<Bill[]> {
    const docs = await BillModel.find({ containerId })
      .sort({ createdAt: -1 })
      .lean();
    return this.mapWithCustomers(docs as BillLeanDoc[]);
  }

  async save(bill: Bill): Promise<Bill> {
    let leanDoc: BillLeanDoc;
    if (bill.id && mongoose.Types.ObjectId.isValid(bill.id)) {
      const updated = await BillModel.findByIdAndUpdate(
        bill.id,
        {
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
          paidAt: bill.paidAt,
          paymentMethod: bill.paymentMethod,
        },
        { new: true, upsert: true },
      ).lean();
      leanDoc = updated as BillLeanDoc;
    } else {
      const created = new BillModel({
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
        paidAt: bill.paidAt,
        paymentMethod: bill.paymentMethod,
      });
      await created.save();
      leanDoc = created.toObject() as BillLeanDoc;
    }

    const [mapped] = await this.mapWithCustomers([leanDoc]);
    return mapped;
  }

  async update(id: string, data: Partial<Bill>): Promise<Bill | null> {
    const doc = await BillModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    if (!doc) return null;
    const [mapped] = await this.mapWithCustomers([doc as BillLeanDoc]);
    return mapped;
  }

  // Helper to fetch user company names in bulk
  private async mapWithCustomers(docs: BillLeanDoc[]): Promise<Bill[]> {
    if (!docs.length) return [];

    // Collect unique customer IDs
    const customerIds = [
      ...new Set(docs.map((d) => d.customer).filter((c): c is string => Boolean(c))),
    ];

    // Fetch users - only for valid ObjectIds if the field expects it
    let userMap: Record<string, string> = {};
    if (customerIds.length > 0) {
      // Filter valid ObjectIds to prevent casting errors
      const validObjectIds = customerIds.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id),
      );

      if (validObjectIds.length > 0) {
        const users = await UserModel.find({ _id: { $in: validObjectIds } })
          .select("_id companyName name")
          .lean();
        userMap = users.reduce(
          (acc, u) => {
            acc[u._id.toString()] =
              u.companyName || u.name || "Unknown Company";
            return acc;
          },
          {} as Record<string, string>,
        );
      }
    }

    return docs.map((doc) => this.mapToEntity(doc, userMap));
  }

  private mapToEntity(doc: BillLeanDoc, userMap: Record<string, string> = {}): Bill {
    const { _id, ...rest } = doc;
    return new Bill(
      _id.toString(),
      rest.billNumber ?? "",
      rest.containerNumber ?? "",
      rest.shippingLine ?? "",
      rest.containerId?.toString(),
      rest.customer ?? null,
      rest.customer ? userMap[rest.customer] : undefined,
      rest.lineItems ?? [],
      rest.totalAmount,
      rest.status,
      rest.dueDate,
      rest.remarks,
      rest.paidAt,
      rest.paymentMethod,
      rest.createdAt,
      rest.updatedAt,
    );
  }

  async aggregateUnpaidAmount(filter: BillAggregateFilter): Promise<BillAggregateResult[]> {
    return await BillModel.aggregate<BillAggregateResult>([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]).exec();
  }
}
