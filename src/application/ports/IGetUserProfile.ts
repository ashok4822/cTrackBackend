import { UserResponseDto } from "../dto/UserDto";

export interface IGetUserProfile {
    execute(id: string): Promise<UserResponseDto | null>;
}
