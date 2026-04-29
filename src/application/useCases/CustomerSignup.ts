import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CustomerSignup {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
  ) { }

  async execute(email: string, password: string, name?: string): Promise<void> {
    const userExists = await this.userRepository.exists(email);

    if (userExists) {
      throw new AppError(ResponseMessage.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = UserMapper.createNew(email, "customer", hashedPassword, name);

    await this.userRepository.save(user);
  }
}

