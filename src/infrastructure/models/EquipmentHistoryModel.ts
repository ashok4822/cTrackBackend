import mongoose, { Schema, Document } from "mongoose";

export interface IEquipmentHistoryDocument extends Document {
    equipmentId: mongoose.Types.ObjectId;
    activity: string;
    details?: string;
    performedBy?: string;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EquipmentHistorySchema: Schema = new Schema(
    {
        equipmentId: { type: Schema.Types.ObjectId, ref: "Equipment", required: true },
        activity: { type: String, required: true },
        details: { type: String },
        performedBy: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export const EquipmentHistoryModel = mongoose.model<IEquipmentHistoryDocument>(
    "EquipmentHistory",
    EquipmentHistorySchema
);
