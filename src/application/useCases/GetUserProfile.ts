import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class GetUserProfile {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
