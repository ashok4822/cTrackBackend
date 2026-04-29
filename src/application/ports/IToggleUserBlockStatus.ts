import { UserContextDto } from "../dto/CommonDto";
import { UserResponseDto } from "../dto/UserDto";

export interface IToggleUserBlockStatus {
    execute(userId: string, userContext: UserContextDto): Promise<UserResponseDto>;
}
