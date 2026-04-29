"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuditLog = void 0;
const AuditMapper_1 = require("../mappers/AuditMapper");
class CreateAuditLog {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async execute(data) {
        const auditLog = AuditMapper_1.AuditMapper.toEntity(data);
        await this.auditLogRepository.save(auditLog);
    }
}
exports.CreateAuditLog = CreateAuditLog;
//# sourceMappingURL=CreateAuditLog.js.map