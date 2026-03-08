import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDocument extends Document {
    userId: mongoose.Types.ObjectId;
    type: "alert" | "info" | "warning" | "success";
    title: string;
    message: string;
    read: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: ["alert", "info", "warning", "success"],
            default: "info",
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        link: { type: String },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries by user and read status
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ createdAt: -1 });

export const NotificationModel = mongoose.model<INotificationDocument>(
    "Notification",
    NotificationSchema
);
