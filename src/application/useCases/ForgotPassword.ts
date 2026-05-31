import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IEmailService } from "../services/IEmailService";
import { IForgotPassword } from "../ports/IForgotPassword";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class ForgotPassword implements IForgotPassword {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _otpRepository: IOtpRepository,
        private readonly _emailService: IEmailService,
    ) { }

    async execute(email: string): Promise<void> {
        const userExists = await this._userRepository.exists(email);
        if (!userExists) {
            
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this._otpRepository.saveOtp(email, otp);
        await this._emailService.sendPasswordResetOtp(email, otp);
    }
}

