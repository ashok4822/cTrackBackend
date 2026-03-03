import mongoose, { Schema, Document } from "mongoose";
import { ChargeHistory } from "../../domain/entities/ChargeHistory";

export interface IChargeHistoryDocument extends ChargeHistory, Document { }

const ChargeHistorySchema: Schema = new Schema(
    {
        chargeId: { type: Schema.Types.ObjectId, ref: "Charge", required: true },
        activityName: { type: String, required: true },
        containerSize: { type: String, required: true },
        containerType: { type: String, required: true },
        oldRate: { type: Number, required: true },
        newRate: { type: Number, required: true },
        currency: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export const ChargeHistoryModel = mongoose.model<IChargeHistoryDocument>(
    "ChargeHistory",
    ChargeHistorySchema
);
