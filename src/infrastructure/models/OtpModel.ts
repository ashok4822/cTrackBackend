import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
    email: string;
    otp: string;
    createdAt: Date;
    updatedAt: Date;
}

const OtpSchema: Schema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 }, // Expires in 1 minute (60 seconds)
}, { timestamps: true });

export const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema);
