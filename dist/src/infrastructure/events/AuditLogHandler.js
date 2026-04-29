"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
const AuditLog_1 = require("../../domain/entities/AuditLog");
class AuditLogHandler {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
        this.initialize();
    }
    initialize() {
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, async (data) => {
            try {
                const auditLog = new AuditLog_1.AuditLog(null, data.userId, data.userRole, data.userName, data.action, data.resourceType, data.resourceId, typeof data.details === "string" ? data.details : JSON.stringify(data.details), data.ipAddress);
                await this.auditLogRepository.save(auditLog);
            }
            catch (error) {
                console.error("[AuditLogHandler] Failed to save audit log:", error);
            }
        });
    }
}
exports.AuditLogHandler = AuditLogHandler;
//# sourceMappingURL=AuditLogHandler.js.map