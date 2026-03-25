import mongoose, { Schema, Document } from "mongoose";

export interface IContainerRequestDocument extends Document {
    customerId: string;
    type: "stuffing" | "destuffing";
    status: string;
    cargoCategoryId?: string | mongoose.Types.ObjectId;

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
    containerId?: mongoose.Types.ObjectId;
    containerNumber?: string;
    remarks?: string;
    checkpoints?: Array<{ location: string, timestamp: Date, status: string, remarks?: string }>;
    cargoCharge?: number;

    createdAt: Date;
    updatedAt: Date;
}

const ContainerRequestSchema: Schema = new Schema(
    {
        customerId: { type: String, required: true },
        type: { type: String, enum: ["stuffing", "destuffing"], required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed", "ready-for-dispatch", "in-transit", "at-factory", "operation-completed", "cancelled"],
            default: "pending"
        },
        cargoCategoryId: { type: Schema.Types.ObjectId, ref: "CargoCategory" },

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
        checkpoints: [{
            location: { type: String },
            timestamp: { type: Date, default: Date.now },
            status: { type: String },
            remarks: { type: String }
        }],
        cargoCharge: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
);

export const ContainerRequestModel = mongoose.model<IContainerRequestDocument>(
    "ContainerRequest",
    ContainerRequestSchema
);
