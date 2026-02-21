import mongoose, { Schema, Document } from "mongoose";

export interface IGateOperationDocument extends Document {
    type: "gate-in" | "gate-out";
    containerNumber?: string;
    vehicleNumber: string;
    driverName: string;
    purpose: "port" | "factory" | "transfer";
    timestamp: Date;
    approvedBy?: string;
    remarks?: string;
}

const GateOperationSchema: Schema = new Schema(
    {
        type: { type: String, enum: ["gate-in", "gate-out"], required: true },
        containerNumber: { type: String, required: false },
        vehicleNumber: { type: String, required: true },
        driverName: { type: String, required: true },
        purpose: { type: String, enum: ["port", "factory", "transfer"], required: true },
        timestamp: { type: Date, default: Date.now },
        approvedBy: { type: String },
        remarks: { type: String },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: any) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export const GateOperationModel = mongoose.model<IGateOperationDocument>(
    "GateOperation",
    GateOperationSchema
);
