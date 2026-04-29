"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const UserModel_1 = require("../models/UserModel");
const BaseRepository_1 = require("./base/BaseRepository");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(UserModel_1.UserModel);
    }
    async findByEmail(email) {
        const userDoc = await this.model.findOne({ email }).exec();
        return userDoc ? this.toEntity(userDoc) : null;
    }
    async findByGoogleId(googleId) {
        const userDoc = await this.model.findOne({ googleId }).exec();
        return userDoc ? this.toEntity(userDoc) : null;
    }
    async findByRole(role) {
        const userDocs = await this.model.find({ role }).exec();
        return userDocs.map((doc) => this.toEntity(doc));
    }
    async exists(query) {
        const actualQuery = typeof query === "string" ? { email: query } : query;
        return super.exists(actualQuery);
    }
    toEntity(userDoc) {
        return new User_1.User(userDoc._id.toString(), userDoc.email, userDoc.role, userDoc.password, userDoc.name, userDoc.phone, userDoc.googleId, userDoc.profileImage, userDoc.companyName, userDoc.isBlocked, userDoc.createdAt, userDoc.updatedAt);
    }
    toModelData(user) {
        return {
            email: user.email,
            password: user.password,
            role: user.role,
            name: user.name,
            phone: user.phone,
            googleId: user.googleId,
            profileImage: user.profileImage,
            companyName: user.companyName,
            isBlocked: user.isBlocked,
        };
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map