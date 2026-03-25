import mongoose, { Schema, Document } from "mongoose";

export interface IBillTransactionDocument extends Document {
    billId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    amount: number;
    method: "pda" | "online";
    status: "pending" | "success" | "failed";
    transactionId?: string;
    orderId?: string;
    errorDetails?: string;
    timestamp: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const BillTransactionSchema: Schema = new Schema(
    {
        billId: { type: Schema.Types.ObjectId, ref: "Bill", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        method: { type: String, enum: ["pda", "online"], required: true },
        status: { type: String, enum: ["pending", "success", "failed"], required: true, default: "pending" },
        transactionId: { type: String },
        orderId: { type: String },
        errorDetails: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Index for faster lookups
BillTransactionSchema.index({ billId: 1, timestamp: -1 });
BillTransactionSchema.index({ orderId: 1 });

export const BillTransactionModel = mongoose.model<IBillTransactionDocument>(
    "BillTransaction",
    BillTransactionSchema
);
