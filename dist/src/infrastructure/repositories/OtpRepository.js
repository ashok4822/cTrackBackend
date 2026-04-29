"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const OtpModel_1 = require("../models/OtpModel");
class OtpRepository {
    async saveOtp(email, otp) {
        await OtpModel_1.OtpModel.create({ email, otp });
    }
    async findOtp(email) {
        const record = await OtpModel_1.OtpModel.findOne({ email }).sort({ createdAt: -1 });
        return record ? { otp: record.otp, createdAt: record.createdAt } : null;
    }
    async deleteOtp(email) {
        await OtpModel_1.OtpModel.deleteMany({ email });
    }
}
exports.OtpRepository = OtpRepository;
//# sourceMappingURL=OtpRepository.js.map