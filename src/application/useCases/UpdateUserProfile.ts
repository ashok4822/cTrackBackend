import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

interface UpdateProfileData {
    name?: string;
    phone?: string;
}

export class UpdateUserProfile {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string, data: UpdateProfileData): Promise<User> {
        // Validation
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
            user.profileImage
        );

        await this.userRepository.save(updatedUser);

        return updatedUser;
    }
}
