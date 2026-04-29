"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const JwtTokenService_1 = require("./JwtTokenService");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const tokenService = new JwtTokenService_1.JwtTokenService();
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(HttpStatus_1.HttpStatus.UNAUTHORIZED)
            .json({ message: ResponseMessage_1.ResponseMessage.NO_TOKEN });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = tokenService.verify(token, process.env.JWT_ACCESS_SECRET || "access_fallback");
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.name === "TokenExpiredError") {
            console.warn("AuthMiddleware: Token expired");
        }
        else {
            console.error("AuthMiddleware: Token verification failed", error);
        }
        return res
            .status(HttpStatus_1.HttpStatus.UNAUTHORIZED)
            .json({ message: ResponseMessage_1.ResponseMessage.INVALID_TOKEN });
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res
                .status(HttpStatus_1.HttpStatus.FORBIDDEN)
                .json({ message: ResponseMessage_1.ResponseMessage.INSUFFICIENT_PERMISSIONS });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=authMiddleWare.js.map