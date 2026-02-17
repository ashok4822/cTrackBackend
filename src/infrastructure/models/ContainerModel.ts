import mongoose, { Schema, Document } from "mongoose";

export interface IContainerDocument extends Document {
  containerNumber: string;
  size: string;
  type: string;
  movementType?: string;
  status: string;
  shippingLine: string;
  customer?: string;
  yardLocation?: { block: string };
  gateInTime?: Date;
  gateOutTime?: Date;
  dwellTime?: number;
  weight?: number;
  cargoWeight?: number;
  sealNumber?: string;
  damaged?: boolean;
  damageDetails?: string;
  blacklisted?: boolean;
  empty?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContainerSchema: Schema = new Schema(
  {
    containerNumber: { type: String, required: true, unique: true },
    size: { type: String, required: true, enum: ["20ft", "40ft"] },
    type: {
      type: String,
      required: true,
      enum: ["standard", "reefer", "tank", "open-top"],
    },
    movementType: { type: String, enum: ["import", "export", "domestic"] },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "gate-in",
        "in-yard",
        "in-transit",
        "at-port",
        "at-factory",
        "gate-out",
        "damaged",
      ],
      default: "pending",
    },
    shippingLine: { type: String, required: true },
    customer: { type: String },
    yardLocation: {
      block: { type: String },
    },
    gateInTime: { type: Date },
    gateOutTime: { type: Date },
    dwellTime: { type: Number },
    weight: { type: Number },
    cargoWeight: { type: Number },
    sealNumber: { type: String },
    damaged: { type: Boolean, default: false },
    damageDetails: { type: String },
    blacklisted: { type: Boolean, default: false },
    empty: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const ContainerModel = mongoose.model<IContainerDocument>(
  "Container",
  ContainerSchema,
);
