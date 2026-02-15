import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class UpdateUserProfileImage {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string, profileImage: string): Promise<User> {
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
            profileImage
        );

        await this.userRepository.save(updatedUser);

        return updatedUser;
    }
}
