import mongoose, { Schema, Document } from "mongoose";
import { Charge } from "../../domain/entities/Charge";

export interface IChargeDocument extends Charge, Document { }

const ChargeSchema: Schema = new Schema(
    {
        activityId: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
        containerSize: { type: String, enum: ["20ft", "40ft", "all"], required: true },
        containerType: {
            type: String,
            enum: ["standard", "reefer", "tank", "all"],
            required: true,
        },
        rate: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        effectiveFrom: { type: Date, default: Date.now },
        effectiveTo: { type: Date },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export const ChargeModel = mongoose.model<IChargeDocument>(
    "Charge",
    ChargeSchema
);
