import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IHashService } from "../services/IHashService";
import { User } from "../../domain/entities/User";

export class ResetPassword {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository,
        private hashService: IHashService,
    ) { }

    async execute(email: string, otp: string, newPassword: string): Promise<void> {
        // Validation for new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new Error(
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
            );
        }

        // 1. Verify OTP with strict expiration check
        const savedOtpData = await this.otpRepository.findOtp(email);
        if (!savedOtpData || savedOtpData.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        const currentTime = new Date().getTime();
        const otpTime = savedOtpData.createdAt.getTime();
        const timeDifference = currentTime - otpTime;

        // 1 minute expiration
        if (timeDifference > 60 * 1000) {
            await this.otpRepository.deleteOtp(email);
            throw new Error("OTP has expired");
        }

        // 2. Find User
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        // 3. Hash New Password
        const hashedPassword = await this.hashService.hash(newPassword);

        // 4. Update User
        // User entity is immutable, create a new instance with updated password
        const updatedUser = new User(
            user.id,
            user.email,
            user.role,
            hashedPassword,
            user.name,
            user.phone,
            user.googleId,
            user.profileImage
        );

        await this.userRepository.save(updatedUser);

        // 5. Cleanup OTP
        await this.otpRepository.deleteOtp(email);
    }
}
