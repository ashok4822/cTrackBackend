import mongoose, { Schema, Document } from "mongoose";
import { CargoCategory } from "../../domain/entities/CargoCategory";

export interface ICargoCategoryDocument extends CargoCategory, Document { }

const CargoCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        active: { type: Boolean, default: true },
        chargePerTon: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export const CargoCategoryModel = mongoose.model<ICargoCategoryDocument>(
    "CargoCategory",
    CargoCategorySchema
);
