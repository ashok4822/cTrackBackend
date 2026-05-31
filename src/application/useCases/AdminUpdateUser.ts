import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAdminUpdateUser } from "../ports/IAdminUpdateUser";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UpdateUserRequestDto, UserResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class AdminUpdateUser implements IAdminUpdateUser {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(userId: string, data: UpdateUserRequestDto): Promise<UserResponseDto> {
        const { userContext } = data;
        
        let nameToUse: string | undefined = undefined;
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 50) {
                throw new AppError(ResponseMessage.INVALID_NAME_LENGTH, HttpStatus.BAD_REQUEST);
            }
            nameToUse = trimmedName;
        }

        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // Create updated user via mapper (using validated trimmed name)
        const updatedUser = UserMapper.applyAdminUpdate(user, { ...data, name: nameToUse });

        await this._userRepository.save(updatedUser);

        // Log audit event
        const changes: string[] = [];
        if (data.name !== undefined) changes.push(`name: ${data.name}`);
        if (data.role !== undefined) changes.push(`role: ${data.role}`);
        if (data.companyName !== undefined) changes.push(`companyName: ${data.companyName}`);
        if (data.isBlocked !== undefined) changes.push(`isBlocked: ${data.isBlocked}`);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_USER_UPDATED,
            resourceType: ResponseMessage.RESOURCE_USER,
            resourceId: userId,
            details: { changes },
            ipAddress: userContext.ipAddress
        });

        return UserMapper.toResponseDto(updatedUser);
    }
}

