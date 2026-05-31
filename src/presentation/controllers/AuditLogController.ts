import { Request, Response } from "express";
import { IGetAuditLogs } from "../../application/ports/IGetAuditLogs";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AuditActionDto, EntityTypeDto, AuditLogFiltersDto } from "../../application/dto/AuditLogDto";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class AuditLogController {
    constructor(private readonly _getAuditLogsUseCase: IGetAuditLogs) { }

    getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
        const {
            startDate,
            endDate,
            userId,
            actionType,
            entityType,
            page,
            limit,
        } = req.query;

        const filters: AuditLogFiltersDto = {};

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
            filters.action = actionType as AuditActionDto;
        }

        if (entityType) {
            filters.entityType = entityType as EntityTypeDto;
        }

        if (page) {
            filters.page = parseInt(page as string, 10);
        }

        if (limit) {
            filters.limit = parseInt(limit as string, 10);
        }

        const result = await this._getAuditLogsUseCase.execute(filters);

        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    });
}


