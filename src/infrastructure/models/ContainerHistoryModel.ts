import mongoose, { Schema, Document } from "mongoose";

export interface IContainerHistoryDocument extends Document {
    containerId: mongoose.Types.ObjectId;
    activity: string;
    details?: string;
    performedBy?: string;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ContainerHistorySchema: Schema = new Schema(
    {
        containerId: { type: Schema.Types.ObjectId, ref: "Container", required: true },
        activity: { type: String, required: true },
        details: { type: String },
        performedBy: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export const ContainerHistoryModel = mongoose.model<IContainerHistoryDocument>(
    "ContainerHistory",
    ContainerHistorySchema
);
