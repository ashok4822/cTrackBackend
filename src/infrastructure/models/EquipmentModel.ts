import mongoose, { Schema, Document } from "mongoose";

export interface IEquipmentDocument extends Document {
    name: string;
    type: string;
    status: string;
    operator?: string;
    lastMaintenance?: Date;
    nextMaintenance?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EquipmentSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        type: {
            type: String,
            required: true,
            enum: ["reach-stacker", "forklift", "crane"],
        },
        status: {
            type: String,
            required: true,
            enum: ["operational", "maintenance", "down", "idle"],
            default: "operational",
        },
        operator: { type: String },
        lastMaintenance: { type: Date },
        nextMaintenance: { type: Date },
    },
    { timestamps: true }
);

export const EquipmentModel = mongoose.model<IEquipmentDocument>(
    "Equipment",
    EquipmentSchema
);
