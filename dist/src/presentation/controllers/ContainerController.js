"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
const userContext_1 = require("../utils/userContext");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class ContainerController {
    createContainerUseCase;
    getAllContainersUseCase;
    getContainerByIdUseCase;
    updateContainerUseCase;
    blacklistContainerUseCase;
    unblacklistContainerUseCase;
    getContainerHistoryUseCase;
    getCustomerContainersUseCase;
    constructor(createContainerUseCase, getAllContainersUseCase, getContainerByIdUseCase, updateContainerUseCase, blacklistContainerUseCase, unblacklistContainerUseCase, getContainerHistoryUseCase, getCustomerContainersUseCase) {
        this.createContainerUseCase = createContainerUseCase;
        this.getAllContainersUseCase = getAllContainersUseCase;
        this.getContainerByIdUseCase = getContainerByIdUseCase;
        this.updateContainerUseCase = updateContainerUseCase;
        this.blacklistContainerUseCase = blacklistContainerUseCase;
        this.unblacklistContainerUseCase = unblacklistContainerUseCase;
        this.getContainerHistoryUseCase = getContainerHistoryUseCase;
        this.getCustomerContainersUseCase = getCustomerContainersUseCase;
    }
    createContainer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this.createContainerUseCase.execute(req.body, userContext);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.CONTAINER_CREATED));
    });
    getAllContainers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const filters = req.query;
        const containers = await this.getAllContainersUseCase.execute(filters);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(containers));
    });
    getContainerById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const container = await this.getContainerByIdUseCase.execute(id);
        if (!container) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(container));
    });
    updateContainer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { equipment: equipmentName, ...data } = req.body;
        const performedBy = req.user?.name || req.user?.email || "System";
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this.updateContainerUseCase.execute({ id, equipmentName, performedBy, ...data }, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.CONTAINER_UPDATED));
    });
    blacklistContainer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this.blacklistContainerUseCase.execute(id, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.CONTAINER_BLACKLISTED));
    });
    unblacklistContainer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this.unblacklistContainerUseCase.execute(id, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.CONTAINER_UNBLACKLISTED));
    });
    getContainerHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const history = await this.getContainerHistoryUseCase.execute(id);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(history));
    });
    getCustomerContainers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const customerName = req.user?.name;
        const customerId = req.user?.id;
        if (!customerName || !customerId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const containers = await this.getCustomerContainersUseCase.execute(customerName, customerId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(containers));
    });
}
exports.ContainerController = ContainerController;
//# sourceMappingURL=ContainerController.js.map