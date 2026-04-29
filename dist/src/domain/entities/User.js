"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    email;
    role;
    password;
    name;
    phone;
    googleId;
    profileImage;
    companyName;
    isBlocked;
    createdAt;
    updatedAt;
    constructor(id, email, role, password, name, phone, googleId, profileImage, companyName, isBlocked = false, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.googleId = googleId;
        this.profileImage = profileImage;
        this.companyName = companyName;
        this.isBlocked = isBlocked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    updatePassword(hashedPassword) {
        return new User(this.id, this.email, this.role, hashedPassword, this.name, this.phone, this.googleId, this.profileImage, this.companyName, this.isBlocked, this.createdAt, new Date());
    }
    updateProfile(data) {
        return new User(this.id, this.email, this.role, this.password, data.name !== undefined ? data.name : this.name, data.phone !== undefined ? data.phone : this.phone, this.googleId, data.profileImage !== undefined ? data.profileImage : this.profileImage, this.companyName, this.isBlocked, this.createdAt, new Date());
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map