"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfile = void 0;
const UserMapper_1 = require("../mappers/UserMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class GetUserProfile {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.USER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        return UserMapper_1.UserMapper.toResponseDto(user);
    }
}
exports.GetUserProfile = GetUserProfile;
//# sourceMappingURL=GetUserProfile.js.map