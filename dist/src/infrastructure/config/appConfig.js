"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.AppConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
dotenv_1.default.config();
class AppConfig {
    get(key) {
        const value = process.env[key];
        if (value === undefined) {
            throw new Error(`${ResponseMessage_1.ResponseMessage.CONFIG_KEY_MISSING}: ${key}`);
        }
        return value;
    }
    getNumber(key) {
        const value = this.get(key);
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`${ResponseMessage_1.ResponseMessage.CONFIG_KEY_NOT_NUMBER}: ${key}`);
        }
        return num;
    }
    getBoolean(key) {
        const value = this.get(key).toLowerCase();
        return value === "true" || value === "1";
    }
}
exports.AppConfig = AppConfig;
exports.appConfig = new AppConfig();
//# sourceMappingURL=appConfig.js.map