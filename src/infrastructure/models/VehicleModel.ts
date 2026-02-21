import mongoose, { Schema, Document } from "mongoose";

export interface IVehicleDocument extends Document {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  type: string;
  status: "in-yard" | "out-of-yard";
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
      required: true,
      enum: ["truck", "trailer", "chassis"],
    },
    status: {
      type: String,
      required: true,
      enum: ["in-yard", "out-of-yard"],
      default: "out-of-yard",
    },
    gpsDeviceId: { type: String },
    currentLocation: { type: String },
  },
  { timestamps: true },
);

export const VehicleModel = mongoose.model<IVehicleDocument>(
  "Vehicle",
  VehicleSchema,
);
