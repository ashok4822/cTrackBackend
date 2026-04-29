"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
exports.globalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7",
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
        status: HttpStatus_1.HttpStatus.TOO_MANY_REQUESTS,
        message: ResponseMessage_1.ResponseMessage.TOO_MANY_REQUESTS,
    },
});
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 50, // Limit each IP to 50 requests per `window` for auth routes
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: HttpStatus_1.HttpStatus.TOO_MANY_REQUESTS,
        message: ResponseMessage_1.ResponseMessage.TOO_MANY_LOGIN_ATTEMPTS,
    },
});
//# sourceMappingURL=rateLimiter.js.map