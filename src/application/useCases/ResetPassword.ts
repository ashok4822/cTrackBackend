import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IHashService } from "../services/IHashService";

import { IResetPassword } from "../ports/IResetPassword";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class ResetPassword implements IResetPassword {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _otpRepository: IOtpRepository,
        private readonly _hashService: IHashService,
    ) { }

    async execute(email: string, otp: string, newPassword: string): Promise<void> {
        // Validation for new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new AppError(
                ResponseMessage.INVALID_PASSWORD_FORMAT,
                HttpStatus.BAD_REQUEST
            );
        }

        // 1. Verify OTP with strict expiration check
        const savedOtpData = await this._otpRepository.findOtp(email);
        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new AppError(ResponseMessage.INVALID_OTP, HttpStatus.BAD_REQUEST);
        }

        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;

        // 5 minute expiration
        if (timeDifference > 300 * 1000) {
            await this._otpRepository.deleteOtp(email);
            throw new AppError(ResponseMessage.OTP_EXPIRED, HttpStatus.BAD_REQUEST);
        }

        // 2. Find User
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // 3. Hash New Password
        const hashedPassword = await this._hashService.hash(newPassword);

        // 4. Update User
        const updatedUser = user.updatePassword(hashedPassword);

        await this._userRepository.save(updatedUser);

        // 5. Cleanup OTP
        await this._otpRepository.deleteOtp(email);
    }
}

