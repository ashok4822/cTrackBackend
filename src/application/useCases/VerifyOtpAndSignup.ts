import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IHashService } from "../services/IHashService";
import { User } from "../../domain/entities/User";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

export class VerifyOtpAndSignup {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository,
        private hashService: IHashService,
        private auditLogRepository?: IAuditLogRepository
    ) { }

    async execute(
        email: string,
        otp: string,
        password: string,
        name: string,
        ipAddress?: string
    ): Promise<void> {
        // Validation for password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error(
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
            );
        }

        const savedOtpData = await this.otpRepository.findOtp(email);
        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;

        if (timeDifference > 300 * 1000) { // 5 minutes in milliseconds
            await this.otpRepository.deleteOtp(email);
            throw new Error("OTP has expired");
        }

        const hashedPassword = await this.hashService.hash(password);
        const user = new User("", email, "customer", hashedPassword, name, undefined, undefined, undefined);

        const savedUser = await this.userRepository.save(user);

        // Audit Log
        if (this.auditLogRepository && ipAddress) {
            await this.auditLogRepository.save(new AuditLog(
                null,
                savedUser.id!,
                savedUser.role,
                savedUser.name || savedUser.email,
                "SIGNUP",
                "User",
                savedUser.id,
                JSON.stringify({ email: savedUser.email }),
                ipAddress
            ));
        }
        await this.otpRepository.deleteOtp(email);
    }
}
