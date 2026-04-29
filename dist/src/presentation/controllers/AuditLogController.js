"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class AuditLogController {
    getAuditLogsUseCase;
    constructor(getAuditLogsUseCase) {
        this.getAuditLogsUseCase = getAuditLogsUseCase;
    }
    getAuditLogs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { startDate, endDate, userId, actionType, entityType, page, limit, } = req.query;
        const filters = {};
        if (startDate) {
            filters.startDate = new Date(startDate);
        }
        if (endDate) {
            filters.endDate = new Date(endDate);
        }
        if (userId) {
            filters.userId = userId;
        }
        if (actionType) {
            filters.action = actionType;
        }
        if (entityType) {
            filters.entityType = entityType;
        }
        if (page) {
            filters.page = parseInt(page, 10);
        }
        if (limit) {
            filters.limit = parseInt(limit, 10);
        }
        const result = await this.getAuditLogsUseCase.execute(filters);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result));
    });
}
exports.AuditLogController = AuditLogController;
//# sourceMappingURL=AuditLogController.js.map