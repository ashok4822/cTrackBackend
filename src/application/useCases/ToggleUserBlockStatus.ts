import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class ToggleUserBlockStatus {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<User> {
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
        return updatedUser;
    }
}
