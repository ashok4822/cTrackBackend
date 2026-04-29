import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IHashService } from "../services/IHashService";
import { IVerifyOtpAndSignup } from "../ports/IVerifyOtpAndSignup";
import { VerifyOtpAndSignupRequestDto } from "../dto/AuthDto";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { AppError } from "../../domain/exceptions/AppError";
import { UserMapper } from "../mappers/UserMapper";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class VerifyOtpAndSignup implements IVerifyOtpAndSignup {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _hashService: IHashService,
        private _eventBus: IEventBus
    ) { }


    async execute(request: VerifyOtpAndSignupRequestDto): Promise<void> {
        const { email, otp, password, name, ipAddress } = request;
        // Validation for password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
      throw new AppError(
        ResponseMessage.INVALID_PASSWORD_FORMAT,
        HttpStatus.BAD_REQUEST
      );
    }

    const savedOtpData = await this._otpRepository.findOtp(email);
    if (!savedOtpData || savedOtpData.otp !== otp) {
      throw new AppError(ResponseMessage.INVALID_OTP, HttpStatus.BAD_REQUEST);
    }

    const currentTime = new Date().getTime();
    const otpTime = savedOtpData.createdAt.getTime();
    const timeDifference = currentTime - otpTime;

    if (timeDifference > 300 * 1000) { // 5 minutes in milliseconds
      await this._otpRepository.deleteOtp(email);
      throw new AppError(ResponseMessage.OTP_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this._hashService.hash(password);
    const user = UserMapper.createNew(email, "customer", hashedPassword, name);

    const savedUser = await this._userRepository.save(user);

    // Event-driven Audit
    if (ipAddress) {
      this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
        userId: savedUser.id!,
        userRole: savedUser.role,
        userName: savedUser.name || savedUser.email,
        action: ResponseMessage.AUDIT_SIGNUP,
        resourceType: ResponseMessage.RESOURCE_USER,
        resourceId: savedUser.id,
        details: { email: savedUser.email },
        ipAddress
      });
    }
    await this._otpRepository.deleteOtp(email);
    }
}

