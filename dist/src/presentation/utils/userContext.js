"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserContext = void 0;
const extractUserContext = (req) => {
    return {
        userId: req.user?.id || 'unknown',
        userName: req.user?.name || req.user?.email || 'unknown',
        userRole: req.user?.role || 'unknown',
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown'
    };
};
exports.extractUserContext = extractUserContext;
//# sourceMappingURL=userContext.js.map