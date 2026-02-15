import mongoose, { Schema, Document } from "mongoose";

export interface IShippingLineDocument extends Document {
    shipping_line_name: string;
    shipping_line_code: string;
    createdAt: Date;
    updatedAt: Date;
}

const ShippingLineSchema: Schema = new Schema(
    {
        shipping_line_name: { type: String, required: true },
        shipping_line_code: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

export const ShippingLineModel = mongoose.model<IShippingLineDocument>(
    "ShippingLine",
    ShippingLineSchema
);
