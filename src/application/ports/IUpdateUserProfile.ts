import { UpdateUserProfileRequestDto, UserResponseDto } from "../dto/UserDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IUpdateUserProfile {
    execute(id: string, data: UpdateUserProfileRequestDto, userContext: UserContextDto): Promise<UserResponseDto>;
}
