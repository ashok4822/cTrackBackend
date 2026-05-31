import { IVerifyResetOtp } from "../ports/IVerifyResetOtp";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class VerifyResetOtp implements IVerifyResetOtp {
    constructor(private readonly _otpRepository: IOtpRepository) { }

    async execute(email: string, otp: string): Promise<void> {
        const savedOtpData = await this._otpRepository.findOtp(email);

        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new AppError(ResponseMessage.INVALID_OTP, HttpStatus.BAD_REQUEST);
        }

        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;

        // 5 minute expiration (matching ResetPassword.ts)
        if (timeDifference > 300 * 1000) {
            await this._otpRepository.deleteOtp(email);
            throw new AppError(ResponseMessage.OTP_EXPIRED, HttpStatus.BAD_REQUEST);
        }
    }
}

