import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

export class ToggleUserBlockStatus {
    constructor(
        private userRepository: IUserRepository,
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute(userId: string, userContext: UserContext): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = new User(
            user.id,
            user.email,
            user.role,
            user.password,
            user.name,
            user.phone,
            user.googleId,
            user.profileImage,
            user.companyName,
            !user.isBlocked
        );

        await this.userRepository.save(updatedUser);

        // Log audit event
        await this.auditLogRepository.save(new AuditLog(
            null,
            userContext.userId,
            userContext.userRole,
            userContext.userName,
            updatedUser.isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
            "User",
            userId,
            JSON.stringify({ isBlocked: updatedUser.isBlocked, userEmail: user.email }),
            userContext.ipAddress
        ));

        return updatedUser;
    }
}
