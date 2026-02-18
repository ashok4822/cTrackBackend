import { AuditLog, AuditAction, EntityType } from "../entities/AuditLog";

export interface AuditLogFilters {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    actionType?: AuditAction;
    entityType?: EntityType;
    page?: number;
    limit?: number;
}

export interface IAuditLogRepository {
    save(auditLog: AuditLog): Promise<AuditLog>;
    findAll(filters?: AuditLogFilters): Promise<{ logs: AuditLog[]; total: number }>;
    findById(id: string): Promise<AuditLog | null>;
}
