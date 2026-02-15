import mongoose, { Schema, Document } from "mongoose";

export interface IYardBlockDocument extends Document {
    name: string;
    capacity: number;
    occupied: number;
}

const YardBlockSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        capacity: { type: Number, required: true },
        occupied: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export const YardBlockModel = mongoose.model<IYardBlockDocument>(
    "YardBlock",
    YardBlockSchema
);
