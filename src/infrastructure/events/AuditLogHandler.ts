import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { AuditLogCreatedPayload } from "../../types/eventPayloads";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

export class AuditLogHandler {
  constructor(
    private auditLogRepository: IAuditLogRepository,
    private eventBus: IEventBus
  ) {
    this.initialize();
  }

  private initialize() {
    this.eventBus.on(DomainEvents.AUDIT_LOG_CREATED, async (data: AuditLogCreatedPayload) => {
      try {
        const auditLog = new AuditLog(
          null,
          data.userId,
          data.userRole,
          data.userName,
          data.action,
          data.resourceType,
          data.resourceId,
          typeof data.details === "string" ? data.details : JSON.stringify(data.details),
          data.ipAddress
        );
        await this.auditLogRepository.save(auditLog);
      } catch (error) {
        console.error("[AuditLogHandler] Failed to save audit log:", error);
      }
    });
  }
}
