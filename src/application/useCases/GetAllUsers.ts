import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetAllUsers } from "../ports/IGetAllUsers";
import { UserCollectionResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";

export class GetAllUsers implements IGetAllUsers {
    constructor(private readonly _userRepository: IUserRepository) { }

    async execute(): Promise<UserCollectionResponseDto> {
        const users = await this._userRepository.findAll();
        return UserMapper.toCollectionResponseDto(users);
    }
}
