import mongoose, { Schema, Document } from "mongoose";

export interface IEquipmentDocument extends Document {
    name: string;
    type: "reach-stacker" | "forklift" | "crane" | "straddle-carrier";
    status: "operational" | "maintenance" | "down";
    lastMaintenance?: Date;
    nextMaintenance?: Date;
    operator?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EquipmentSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        type: {
            type: String,
            enum: ["reach-stacker", "forklift", "crane", "straddle-carrier"],
            required: true,
        },
        status: {
            type: String,
            enum: ["operational", "maintenance", "down"],
            default: "operational",
        },
        lastMaintenance: { type: Date },
        nextMaintenance: { type: Date },
        operator: { type: String },
    },
    {
        timestamps: true,
    }
);

export const EquipmentModel = mongoose.model<IEquipmentDocument>(
    "Equipment",
    EquipmentSchema
);
