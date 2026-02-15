import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserRole } from "../../domain/entities/User";

interface AdminUpdateData {
    name?: string;
    role?: UserRole;
    companyName?: string;
}

export class AdminUpdateUser {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string, data: AdminUpdateData): Promise<User> {
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 50) {
                throw new Error("Name must be between 3 and 50 characters");
            }
            data.name = trimmedName;
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Create updated user with new data
        const updatedUser = new User(
            user.id,
            user.email,
            data.role !== undefined ? data.role : user.role,
            user.password,
            data.name !== undefined ? data.name : user.name,
            user.phone,
            user.googleId,
            user.profileImage,
            data.companyName !== undefined ? data.companyName : user.companyName,
            user.isBlocked
        );

        await this.userRepository.save(updatedUser);

        return updatedUser;
    }
}
