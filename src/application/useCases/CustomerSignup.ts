import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";

export class CustomerSignup {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
  ) { }

  async execute(email: string, password: string, name?: string): Promise<void> {
    const userExists = await this.userRepository.exists(email);

    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = new User("", email, "customer", hashedPassword, name, undefined, undefined, undefined);

    await this.userRepository.save(user);
  }
}
