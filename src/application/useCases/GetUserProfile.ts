import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetUserProfile } from "../ports/IGetUserProfile";
import { UserResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class GetUserProfile implements IGetUserProfile {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return UserMapper.toResponseDto(user);
    }
}

