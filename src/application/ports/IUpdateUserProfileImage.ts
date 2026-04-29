import { UserResponseDto } from "../dto/UserDto";

export interface IUpdateUserProfileImage {
    execute(id: string, profileImage: string): Promise<UserResponseDto>;
}
