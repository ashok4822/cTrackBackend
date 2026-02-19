import { IAuditLogRepository, AuditLogFilters } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

export class GetAuditLogs {
    constructor(private auditLogRepository: IAuditLogRepository) { }

    async execute(filters?: AuditLogFilters): Promise<{ logs: AuditLog[]; total: number; page: number; limit: number }> {
        const result = await this.auditLogRepository.findAll(filters);

        return {
            logs: result.logs,
            total: result.total,
            page: filters?.page || 1,
            limit: filters?.limit || 50,
        };
    }
}
