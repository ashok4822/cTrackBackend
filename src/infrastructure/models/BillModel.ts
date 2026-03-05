import mongoose, { Schema, Document } from "mongoose";
import { Bill } from "../../domain/entities/Bill";

export interface IBillDocument extends Document {
    billNumber: string;
    containerNumber: string;
    containerId: mongoose.Types.ObjectId;
    shippingLine: string;
    customer?: string;
    lineItems: {
        activityCode: string;
        activityName: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }[];
    totalAmount: number;
    status: "pending" | "paid" | "overdue";
    dueDate: Date;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LineItemSchema = new Schema({
    activityCode: { type: String, required: true },
    activityName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const BillSchema: Schema = new Schema(
    {
        billNumber: { type: String, required: true, unique: true },
        containerNumber: { type: String, required: true },
        containerId: { type: Schema.Types.ObjectId, ref: "Container" },
        shippingLine: { type: String, required: true },
        customer: { type: String },
        lineItems: [LineItemSchema],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
        dueDate: { type: Date, required: true },
        remarks: { type: String },
    },
    {
        timestamps: true,
    }
);

export const BillModel = mongoose.model<IBillDocument>("Bill", BillSchema);
