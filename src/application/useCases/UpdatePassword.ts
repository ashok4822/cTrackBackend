import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IHashService } from "../services/IHashService";
import { UserContext } from "../ports/IAdminCreateUser";
import { IUpdatePassword } from "../ports/IUpdatePassword";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdatePassword implements IUpdatePassword {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashService: IHashService,
        private readonly _eventBus: IEventBus
    ) { }


    async execute(
        userId: string,
        currentPassword: string,
        newPassword: string,
        confirmPassword: string,
        userContext: UserContext
    ): Promise<void> {
        // Validation for new password matching
        if (newPassword !== confirmPassword) {
            throw new AppError(ResponseMessage.PASSWORD_MISMATCH, HttpStatus.BAD_REQUEST);
        }

        // Validation for new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new AppError(
                ResponseMessage.INVALID_PASSWORD_FORMAT,
                HttpStatus.BAD_REQUEST
            );
        }

        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new AppError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // Check if user has a password (not Google OAuth user)
        if (!user.password) {
            throw new AppError(ResponseMessage.OAUTH_USER_PASSWORD_ERROR, HttpStatus.BAD_REQUEST);
        }

        // Verify current password
        const isPasswordValid = await this._hashService.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new AppError(ResponseMessage.INCORRECT_CURRENT_PASSWORD, HttpStatus.BAD_REQUEST);
        }

        // Hash new password
        const hashedPassword = await this._hashService.hash(newPassword);

        // Update user via domain method
        const updatedUser = user.updatePassword(hashedPassword);

        await this._userRepository.save(updatedUser);

        // Log audit event (Event-driven)
        this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage.AUDIT_PASSWORD_UPDATED,
            resourceType: ResponseMessage.RESOURCE_PROFILE,
            resourceId: userId,
            details: { message: ResponseMessage.PASSWORD_UPDATE_SUCCESS },
            ipAddress: userContext.ipAddress
        });
    }
}

