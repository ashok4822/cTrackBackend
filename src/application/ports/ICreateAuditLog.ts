import { CreateAuditLogRequestDto } from "../dto/AuditLogDto";

export interface ICreateAuditLog {
    execute(data: CreateAuditLogRequestDto): Promise<void>;
}

