"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
class AuditLog {
    id;
    userId;
    userRole;
    userName;
    action;
    entityType;
    entityId;
    details;
    ipAddress;
    timestamp;
    createdAt;
    updatedAt;
    constructor(id, userId, userRole, userName, action, entityType, entityId, details, ipAddress, timestamp = new Date(), createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.userRole = userRole;
        this.userName = userName;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.AuditLog = AuditLog;
//# sourceMappingURL=AuditLog.js.map