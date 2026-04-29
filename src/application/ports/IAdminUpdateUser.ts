import { UpdateUserRequestDto, UserResponseDto } from "../dto/UserDto";

export interface IAdminUpdateUser {
    execute(userId: string, data: UpdateUserRequestDto): Promise<UserResponseDto>;
}
