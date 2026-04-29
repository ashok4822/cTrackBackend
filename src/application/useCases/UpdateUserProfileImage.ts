import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUpdateUserProfileImage } from "../ports/IUpdateUserProfileImage";
import { UserResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateUserProfileImage implements IUpdateUserProfileImage {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string, profileImage: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updatedUser = user.updateProfile({ profileImage });

        await this.userRepository.save(updatedUser);

        return UserMapper.toResponseDto(updatedUser);
    }
}

