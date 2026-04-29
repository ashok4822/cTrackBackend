"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSignup = void 0;
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CustomerSignup {
    userRepository;
    hashService;
    constructor(userRepository, hashService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
    }
    async execute(email, password, name) {
        const userExists = await this.userRepository.exists(email);
        if (userExists) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_ALREADY_EXISTS, HttpStatus_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await this.hashService.hash(password);
        const user = UserMapper_1.UserMapper.createNew(email, "customer", hashedPassword, name);
        await this.userRepository.save(user);
    }
}
exports.CustomerSignup = CustomerSignup;
//# sourceMappingURL=CustomerSignup.js.map