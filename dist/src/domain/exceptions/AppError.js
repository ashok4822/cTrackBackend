"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
class AppError extends Error {
    message;
    statusCode;
    isOperational;
    constructor(message, statusCode = HttpStatus_1.HttpStatus.BAD_REQUEST, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map