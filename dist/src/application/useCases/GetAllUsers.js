"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsers = void 0;
const UserMapper_1 = require("../mappers/UserMapper");
class GetAllUsers {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        const users = await this.userRepository.findAll();
        return UserMapper_1.UserMapper.toCollectionResponseDto(users);
    }
}
exports.GetAllUsers = GetAllUsers;
//# sourceMappingURL=GetAllUsers.js.map