"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHashService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptHashService {
    async hash(data) {
        return bcrypt_1.default.hash(data, 10);
    }
    async compare(data, encrypted) {
        return bcrypt_1.default.compare(data, encrypted);
    }
}
exports.BcryptHashService = BcryptHashService;
//# sourceMappingURL=BcryptHashService.js.map