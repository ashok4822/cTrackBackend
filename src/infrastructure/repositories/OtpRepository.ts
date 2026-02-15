import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { OtpModel } from "../models/OtpModel";

export class OtpRepository implements IOtpRepository {
    async saveOtp(email: string, otp: string): Promise<void> {
        await OtpModel.create({ email, otp });
    }

    async findOtp(email: string): Promise<{ otp: string; createdAt: Date } | null> {
        const record = await OtpModel.findOne({ email }).sort({ createdAt: -1 });
        return record ? { otp: record.otp, createdAt: record.createdAt } : null;
    }

    async deleteOtp(email: string): Promise<void> {
        await OtpModel.deleteMany({ email });
    }
}
