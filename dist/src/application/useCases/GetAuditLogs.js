"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAuditLogs = void 0;
const AuditMapper_1 = require("../mappers/AuditMapper");
class GetAuditLogs {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async execute(filters) {
        // AuditLogFiltersDto is structurally compatible with AuditLogFilters
        const result = await this.auditLogRepository.findAll(filters);
        return AuditMapper_1.AuditMapper.toCollectionResponseDto(result.logs, result.total, filters?.page ?? 1, filters?.limit ?? 50);
    }
}
exports.GetAuditLogs = GetAuditLogs;
//# sourceMappingURL=GetAuditLogs.js.map