import { AuditLogCollectionResponseDto, AuditLogFiltersDto } from "../dto/AuditLogDto";

export interface IGetAuditLogs {
    execute(filters?: AuditLogFiltersDto): Promise<AuditLogCollectionResponseDto>;
}

