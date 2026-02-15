import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { User } from "../../domain/entities/User";

export class UpdatePassword {
    constructor(
        private userRepository: IUserRepository,
        private hashService: IHashService
    ) { }

    async execute(
        userId: string,
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<void> {
        // Validation for new password matching
        if (newPassword !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        // Validation for new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new Error(
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
            );
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Check if user has a password (not Google OAuth user)
        if (!user.password) {
            throw new Error("Cannot update password for OAuth users");
        }

        // Verify current password
        const isPasswordValid = await this.hashService.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Hash new password
        const hashedPassword = await this.hashService.hash(newPassword);

        // Create updated user with new password
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
    }
}
