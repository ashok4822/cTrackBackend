import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { ICreateAuditLog } from "../ports/ICreateAuditLog";
import { CreateAuditLogRequestDto } from "../dto/AuditLogDto";
import { AuditMapper } from "../mappers/AuditMapper";

export class CreateAuditLog implements ICreateAuditLog {
    constructor(private auditLogRepository: IAuditLogRepository) { }

    async execute(data: CreateAuditLogRequestDto): Promise<void> {
        const auditLog = AuditMapper.toEntity(data);
        await this.auditLogRepository.save(auditLog);
    }
}

