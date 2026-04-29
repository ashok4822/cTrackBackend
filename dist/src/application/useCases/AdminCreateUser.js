"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCreateUser = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const crypto_1 = __importDefault(require("crypto"));
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class AdminCreateUser {
    userRepository;
    hashService;
    emailService;
    eventBus;
    constructor(userRepository, hashService, emailService, eventBus) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.emailService = emailService;
        this.eventBus = eventBus;
    }
    async execute(data) {
        const { email, role, name, userContext } = data;
        // Business rule is that only admins can call this.
        // The controller/middleware handle the auth check.
        const userExists = await this.userRepository.exists(email);
        if (userExists) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_ALREADY_EXISTS, HttpStatus_1.HttpStatus.CONFLICT);
        }
        // Auto-generate a secure password
        const password = crypto_1.default.randomBytes(8).toString("hex");
        const hashedPassword = await this.hashService.hash(password);
        const user = UserMapper_1.UserMapper.createNew(email, role, hashedPassword, name);
        const savedUser = await this.userRepository.save(user);
        // Log audit event (Event-driven)
        this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: ResponseMessage_1.ResponseMessage.AUDIT_USER_CREATED,
            resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_USER,
            resourceId: savedUser.id,
            details: { email, role, name },
            ipAddress: userContext.ipAddress
        });
        // Send welcome email with the generated password
        await this.emailService.sendWelcomeEmail(email, password, name);
        return UserMapper_1.UserMapper.toResponseDto(savedUser);
    }
}
exports.AdminCreateUser = AdminCreateUser;
//# sourceMappingURL=AdminCreateUser.js.map