import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IToggleUserBlockStatus } from "../ports/IToggleUserBlockStatus";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UserContextDto } from "../dto/CommonDto";
import { UserResponseDto } from "../dto/UserDto";
import { UserMapper } from "../mappers/UserMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class ToggleUserBlockStatus implements IToggleUserBlockStatus {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(userId: string, userContext: UserContextDto): Promise<UserResponseDto> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updatedUser = UserMapper.applyBlockToggle(user);

        await this._userRepository.save(updatedUser);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: updatedUser.isBlocked ? ResponseMessage.USER_BLOCKED : ResponseMessage.USER_UNBLOCKED,
            resourceType: ResponseMessage.RESOURCE_USER,
            resourceId: userId,
            details: { isBlocked: updatedUser.isBlocked, userEmail: user.email },
            ipAddress: userContext.ipAddress
        });

        return UserMapper.toResponseDto(updatedUser);
    }
}

