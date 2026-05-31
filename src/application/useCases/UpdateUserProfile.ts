import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUpdateUserProfile } from "../ports/IUpdateUserProfile";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { UpdateUserProfileRequestDto, UserResponseDto } from "../dto/UserDto";
import { UserContextDto } from "../dto/CommonDto";
import { UserMapper } from "../mappers/UserMapper";
import { DiffUtil } from "../../shared/utils/DiffUtil";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateUserProfile implements IUpdateUserProfile {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(userId: string, data: UpdateUserProfileRequestDto, userContext: UserContextDto): Promise<UserResponseDto> {
        // Validation for name and phone (already present)
        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 50) {
                throw new AppError(ResponseMessage.INVALID_NAME_LENGTH, HttpStatus.BAD_REQUEST);
            }
        }

        if (data.phone !== undefined && data.phone !== "") {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(data.phone)) {
                throw new AppError(ResponseMessage.INVALID_PHONE_FORMAT, HttpStatus.BAD_REQUEST);
            }
        }

        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // Create updated user via domain method
        const updatedUser = user.updateProfile({
            name: data.name,
            phone: data.phone,
            companyName: data.companyName
        });

        await this._userRepository.save(updatedUser);

        // Log audit event via DiffUtil
        const changes = DiffUtil.getChanges(user as unknown as Record<string, unknown>, updatedUser as unknown as Record<string, unknown>, ["password", "id", "updatedAt", "createdAt"]);

        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_PROFILE_UPDATED,
            resourceType: ResponseMessage.RESOURCE_PROFILE,
            resourceId: userId,
            details: { changes },
            ipAddress: userContext.ipAddress
        });

        return UserMapper.toResponseDto(updatedUser);
    }
}

