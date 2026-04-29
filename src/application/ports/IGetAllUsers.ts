import { UserCollectionResponseDto } from "../dto/UserDto";

export interface IGetAllUsers {
    execute(): Promise<UserCollectionResponseDto>;
}
