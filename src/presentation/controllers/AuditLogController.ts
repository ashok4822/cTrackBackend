import { Request, Response } from "express";
import { GetAuditLogs } from "../../application/useCases/GetAuditLogs";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { AuditAction, EntityType } from "../../domain/entities/AuditLog";
import { AuditLogFilters } from "../../domain/repositories/IAuditLogRepository";

export class AuditLogController {
    constructor(private getAuditLogsUseCase: GetAuditLogs) { }

    async getAuditLogs(req: Request, res: Response) {
        try {
            const {
                startDate,
                endDate,
                userId,
                actionType,
                entityType,
                page,
                limit,
            } = req.query;

            const filters: AuditLogFilters = {};

            if (startDate) {
                filters.startDate = new Date(startDate as string);
            }

            if (endDate) {
                filters.endDate = new Date(endDate as string);
            }

            if (userId) {
                filters.userId = userId as string;
            }

            if (actionType) {
                filters.actionType = actionType as AuditAction;
            }

            if (entityType) {
                filters.entityType = entityType as EntityType;
            }

            if (page) {
                filters.page = parseInt(page as string, 10);
            }

            if (limit) {
                filters.limit = parseInt(limit as string, 10);
            }

            const result = await this.getAuditLogsUseCase.execute(filters);

            return res.status(HttpStatus.OK).json(result);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "An unknown error occurred";
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
}
