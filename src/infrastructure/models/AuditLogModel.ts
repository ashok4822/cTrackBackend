import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLogDocument extends Document {
    userId: string;
    userRole: string;
    userName: string;
    action: string;
    entityType: string;
    entityId?: string;
    details: string;
    ipAddress: string;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AuditLogSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        userRole: { type: String, required: true },
        userName: { type: String, required: true },
        action: { type: String, required: true, index: true },
        entityType: { type: String, required: true, index: true },
        entityId: { type: String },
        details: { type: String, required: true },
        ipAddress: { type: String, required: true },
        timestamp: { type: Date, default: Date.now, index: true },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient filtering
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ entityType: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

export const AuditLogModel = mongoose.model<IAuditLogDocument>(
    "AuditLog",
    AuditLogSchema
);
