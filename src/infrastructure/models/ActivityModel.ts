import mongoose, { Schema, Document } from "mongoose";
import { Activity } from "../../domain/entities/Activity";

export interface IActivityDocument extends Activity, Document { }

const ActivitySchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            enum: ["handling", "storage", "stuffing", "transport", "other"],
            required: true,
        },
        unitType: {
            type: String,
            enum: ["per-container", "per-day", "per-hour", "per-teu", "fixed"],
            required: true,
        },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export const ActivityModel = mongoose.model<IActivityDocument>(
    "Activity",
    ActivitySchema
);
