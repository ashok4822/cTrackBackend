import mongoose, { Schema, Document } from "mongoose";

export interface IBlockDocument extends Document {
    name: string;
    capacity: number;
    occupied: number;
    createdAt: Date;
    updatedAt: Date;
}

const BlockSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        capacity: { type: Number, required: true },
        occupied: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export const BlockModel = mongoose.model<IBlockDocument>(
    "Block",
    BlockSchema
);
