import mongoose, { Schema, Document } from "mongoose";

export interface IGateOperationDocument extends Document {
    type: "gate-in" | "gate-out";
    containerNumber: string;
    vehicleNumber: string;
    driverName: string;
    purpose: "port" | "factory" | "transfer";
    status: "pending" | "approved" | "completed" | "rejected";
    timestamp: Date;
    approvedBy?: string;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GateOperationSchema: Schema = new Schema(
    {
        type: { type: String, enum: ["gate-in", "gate-out"], required: true },
        containerNumber: { type: String, required: true },
        vehicleNumber: { type: String, required: true },
        driverName: { type: String, required: true },
        purpose: { type: String, enum: ["port", "factory", "transfer"], required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "completed", "rejected"],
            required: true,
            default: "pending"
        },
        timestamp: { type: Date, default: Date.now },
        approvedBy: { type: String },
        remarks: { type: String }
    },
    {
        timestamps: true,
    }
);

export const GateOperationModel = mongoose.model<IGateOperationDocument>(
    "GateOperation",
    GateOperationSchema
);
