import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IEmailService } from "../services/IEmailService";

export class InitiateSignup {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService,
    ) { }

    async execute(email: string): Promise<void> {
        const userExists = await this.userRepository.exists(email);
        if (userExists) {
            throw new Error("User already exists");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.saveOtp(email, otp);
        await this.emailService.sendOtp(email, otp);
    }
}
