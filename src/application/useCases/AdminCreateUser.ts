
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { IEmailService } from "../services/IEmailService";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import crypto from "crypto";
import { IAdminCreateUser } from "../ports/IAdminCreateUser";
import { CreateUserRequestDto, UserResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class AdminCreateUser implements IAdminCreateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private emailService: IEmailService,
    private eventBus: IEventBus,
  ) { }


  async execute(data: CreateUserRequestDto): Promise<UserResponseDto> {
    const { email, role, name, userContext } = data;
    // Business rule is that only admins can call this.
    // The controller/middleware handle the auth check.

    const userExists = await this.userRepository.exists(email);

    if (userExists) {
      throw new AppError(ResponseMessage.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    // Auto-generate a secure password
    const password = crypto.randomBytes(8).toString("hex");

    const hashedPassword = await this.hashService.hash(password);
    const user = UserMapper.createNew(email, role, hashedPassword, name);

    const savedUser = await this.userRepository.save(user);

    // Log audit event (Event-driven)
    this.eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
      userId: userContext.userId,
      userRole: userContext.userRole,
      userName: userContext.userName,
      action: ResponseMessage.AUDIT_USER_CREATED,
      resourceType: ResponseMessage.RESOURCE_USER,
      resourceId: savedUser.id,
      details: { email, role, name },
      ipAddress: userContext.ipAddress
    });

    // Send welcome email with the generated password
    await this.emailService.sendWelcomeEmail(email, password, name);

    return UserMapper.toResponseDto(savedUser);
  }
}

