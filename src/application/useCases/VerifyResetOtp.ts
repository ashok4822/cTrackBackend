import { IOtpRepository } from "../../domain/repositories/IOtpRepository";

export class VerifyResetOtp {
    constructor(private otpRepository: IOtpRepository) { }

    async execute(email: string, otp: string): Promise<void> {
        const savedOtpData = await this.otpRepository.findOtp(email);

        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;

        // 5 minute expiration (matching ResetPassword.ts)
        if (timeDifference > 300 * 1000) {
            await this.otpRepository.deleteOtp(email);
            throw new Error("OTP has expired");
        }
    }
}
