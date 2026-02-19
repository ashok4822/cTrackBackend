import mongoose, { Schema, Document } from "mongoose";

export interface IVehicleDocument extends Document {
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    type: "truck" | "trailer" | "chassis";
    status: "active" | "inactive" | "maintenance";
    gpsDeviceId?: string;
    currentLocation?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VehicleSchema: Schema = new Schema(
    {
        vehicleNumber: { type: String, required: true, unique: true },
        driverName: { type: String, required: true },
        driverPhone: { type: String, required: true },
        type: {
            type: String,
            enum: ["truck", "trailer", "chassis"],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "maintenance"],
            default: "inactive",
        },
        gpsDeviceId: { type: String },
        currentLocation: { type: String },
    },
    {
        timestamps: true,
    }
);

export const VehicleModel = mongoose.model<IVehicleDocument>(
    "Vehicle",
    VehicleSchema
);
