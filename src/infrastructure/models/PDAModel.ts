import mongoose, { Schema, Document } from "mongoose";

export interface IPDADocument extends Document {
    userId: mongoose.Types.ObjectId;
    customer: string;
    balance: number;
    lastUpdated: Date;
}

const PDASchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        customer: { type: String, required: true },
        balance: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const PDAModel = mongoose.model<IPDADocument>("PDA", PDASchema);

export interface IPDATransactionDocument extends Document {
    pdaId: mongoose.Types.ObjectId;
    type: "credit" | "debit";
    amount: number;
    description: string;
    balanceAfter: number;
    timestamp: Date;
}

const PDATransactionSchema: Schema = new Schema(
    {
        pdaId: { type: Schema.Types.ObjectId, ref: "PDA", required: true },
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        balanceAfter: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const PDATransactionModel = mongoose.model<IPDATransactionDocument>(
    "PDATransaction",
    PDATransactionSchema
);
