"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateOperationController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const userContext_1 = require("../utils/userContext");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class GateOperationController {
    getGateOperationsUseCase;
    createGateOperationUseCase;
    constructor(getGateOperationsUseCase, createGateOperationUseCase) {
        this.getGateOperationsUseCase = getGateOperationsUseCase;
        this.createGateOperationUseCase = createGateOperationUseCase;
    }
    getGateOperations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const filters = req.query;
        const operations = await this.getGateOperationsUseCase.execute({
            ...filters,
            limit: filters.limit ? parseInt(filters.limit, 10) : undefined
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(operations));
    });
    createGateOperation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const performedBy = req.user?.name || req.user?.email || "System";
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this.createGateOperationUseCase.execute(req.body, userContext, performedBy);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.GATE_OPERATION_SUCCESS));
    });
}
exports.GateOperationController = GateOperationController;
//# sourceMappingURL=GateOperationController.js.map