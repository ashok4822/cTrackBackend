import mongoose, { Schema, Document } from "mongoose";

export interface IContainerRequestDocument extends Document {
    customerId: string;
    type: "stuffing" | "destuffing";
    status: string;

    // Stuffing specific fields
    containerSize?: string;
    containerType?: string;
    cargoDescription?: string;
    cargoWeight?: number;
    preferredDate?: Date;
    specialInstructions?: string;

    // Hazardous classification
    isHazardous?: boolean;
    hazardClass?: string;
    unNumber?: string;
    packingGroup?: string;

    // Destuffing specific fields
    containerId?: Schema.Types.ObjectId;
    containerNumber?: string;
    remarks?: string;

    createdAt: Date;
    updatedAt: Date;
}

const ContainerRequestSchema: Schema = new Schema(
    {
        customerId: { type: String, required: true },
        type: { type: String, enum: ["stuffing", "destuffing"], required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
            default: "pending"
        },

        // Stuffing specific fields
        containerSize: { type: String },
        containerType: { type: String },
        cargoDescription: { type: String },
        cargoWeight: { type: Number },
        preferredDate: { type: Date },
        specialInstructions: { type: String },

        // Hazardous classification
        isHazardous: { type: Boolean, default: false },
        hazardClass: { type: String },
        unNumber: { type: String },
        packingGroup: { type: String },

        // Destuffing specific fields
        containerId: { type: Schema.Types.ObjectId, ref: "Container" },
        containerNumber: { type: String },
        remarks: { type: String },
    },
    {
        timestamps: true,
    }
);

export const ContainerRequestModel = mongoose.model<IContainerRequestDocument>(
    "ContainerRequest",
    ContainerRequestSchema
);
