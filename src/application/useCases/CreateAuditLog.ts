import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog, AuditAction, EntityType } from "../../domain/entities/AuditLog";

export interface CreateAuditLogData {
    userId: string;
    userRole: string;
    userName: string;
    action: AuditAction;
    entityType: EntityType;
    entityId?: string;
    details: string;
    ipAddress: string;
}

export class CreateAuditLog {
    constructor(private auditLogRepository: IAuditLogRepository) { }

    async execute(data: CreateAuditLogData): Promise<void> {
        const auditLog = new AuditLog(
            null,
            data.userId,
            data.userRole,
            data.userName,
            data.action,
            data.entityType,
            data.entityId || null,
            data.details,
            data.ipAddress
        );

        await this.auditLogRepository.save(auditLog);
    }
}
