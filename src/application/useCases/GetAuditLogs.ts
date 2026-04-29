import { IGetAuditLogs } from "../ports/IGetAuditLogs";
import { IAuditLogRepository, AuditLogFilters } from "../../domain/repositories/IAuditLogRepository";
import { AuditLogCollectionResponseDto, AuditLogFiltersDto } from "../dto/AuditLogDto";
import { AuditMapper } from "../mappers/AuditMapper";

export class GetAuditLogs implements IGetAuditLogs {
    constructor(private auditLogRepository: IAuditLogRepository) { }

    async execute(filters?: AuditLogFiltersDto): Promise<AuditLogCollectionResponseDto> {
        // AuditLogFiltersDto is structurally compatible with AuditLogFilters
        const result = await this.auditLogRepository.findAll(filters as AuditLogFilters | undefined);

        return AuditMapper.toCollectionResponseDto(
            result.logs,
            result.total,
            filters?.page ?? 1,
            filters?.limit ?? 50
        );
    }
}
