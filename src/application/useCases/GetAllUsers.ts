import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetAllUsers } from "../ports/IGetAllUsers";
import { UserCollectionResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";

export class GetAllUsers implements IGetAllUsers {
    constructor(private userRepository: IUserRepository) { }

    async execute(): Promise<UserCollectionResponseDto> {
        const users = await this.userRepository.findAll();
        return UserMapper.toCollectionResponseDto(users);
    }
}
