"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const User_1 = require("../../domain/entities/User");
class UserMapper {
    /** Create a brand-new User entity for registration / admin creation flows */
    static createNew(email, role, hashedPassword, name) {
        return new User_1.User("", email, role, hashedPassword, name, undefined, undefined, undefined);
    }
    /** Create a new User entity from a Google OAuth profile */
    static createFromGoogle(email, googleId, name, profileImage) {
        return new User_1.User("", email, "customer", undefined, name, undefined, googleId, profileImage);
    }
    /** Link an existing User entity to a Google account */
    static linkGoogle(user, googleId, name, profileImage) {
        return new User_1.User(user.id, user.email, user.role, user.password, (user.name || name), user.phone, googleId, user.profileImage || profileImage);
    }
    /** Apply an admin-initiated update to an existing User entity */
    static applyAdminUpdate(user, data) {
        return new User_1.User(user.id, user.email, data.role !== undefined ? data.role : user.role, user.password, data.name !== undefined ? data.name : user.name, data.phone !== undefined ? data.phone : user.phone, user.googleId, user.profileImage, data.companyName !== undefined ? data.companyName : user.companyName, data.isBlocked !== undefined ? data.isBlocked : user.isBlocked);
    }
    /** Toggle the isBlocked flag on an existing User entity */
    static applyBlockToggle(user) {
        return new User_1.User(user.id, user.email, user.role, user.password, user.name, user.phone, user.googleId, user.profileImage, user.companyName, !user.isBlocked);
    }
    static toResponseDto(entity) {
        return {
            id: entity.id,
            email: entity.email,
            role: entity.role,
            name: entity.name,
            phone: entity.phone,
            profileImage: entity.profileImage,
            companyName: entity.companyName,
            isBlocked: entity.isBlocked,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    static toCollectionResponseDto(entities) {
        return {
            items: entities.map(user => this.toResponseDto(user)),
            total: entities.length,
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=UserMapper.js.map