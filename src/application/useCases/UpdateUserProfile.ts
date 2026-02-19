import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

interface UpdateProfileData {
    name?: string;
    phone?: string;
    companyName?: string;
}

export class UpdateUserProfile {
    constructor(
        private userRepository: IUserRepository,
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute(userId: string, data: UpdateProfileData, userContext: UserContext): Promise<User> {
        // Validation for name and phone (already present)
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 50) {
                throw new Error("Name must be between 3 and 50 characters");
            }
            data.name = trimmedName;
        }

        if (data.phone !== undefined && data.phone !== "") {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(data.phone)) {
                throw new Error("Invalid phone number format");
            }
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Create updated user with new data
        const updatedUser = new User(
            user.id,
            user.email,
            user.role,
            user.password,
            data.name !== undefined ? data.name : user.name,
            data.phone !== undefined ? data.phone : user.phone,
            user.googleId,
            user.profileImage,
            data.companyName !== undefined ? data.companyName : user.companyName
        );

        await this.userRepository.save(updatedUser);

        // Log audit event
        const changes: string[] = [];
        if (data.name !== undefined) changes.push(`name: ${data.name}`);
        if (data.phone !== undefined) changes.push(`phone: ${data.phone}`);
        if (data.companyName !== undefined) changes.push(`companyName: ${data.companyName}`);

        await this.auditLogRepository.save(new AuditLog(
            null,
            userContext.userId,
            userContext.userRole,
            userContext.userName,
            "PROFILE_UPDATED",
            "Profile",
            userId,
            JSON.stringify({ changes }),
            userContext.ipAddress
        ));

        return updatedUser;
    }
}
