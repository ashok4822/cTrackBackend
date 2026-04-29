"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRequestController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const AppError_1 = require("../../domain/exceptions/AppError");
const userContext_1 = require("../utils/userContext");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class ContainerRequestController {
    createContainerRequest;
    getCustomerRequests;
    getContainerById;
    getAllContainerRequests;
    updateContainerRequest;
    getContainerRequestById;
    constructor(createContainerRequest, getCustomerRequests, getContainerById, getAllContainerRequests, updateContainerRequest, getContainerRequestById) {
        this.createContainerRequest = createContainerRequest;
        this.getCustomerRequests = getCustomerRequests;
        this.getContainerById = getContainerById;
        this.getAllContainerRequests = getAllContainerRequests;
        this.updateContainerRequest = updateContainerRequest;
        this.getContainerRequestById = getContainerRequestById;
    }
    create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const customerId = req.user?.id || req.body.customerId;
        if (!customerId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        // If it's a destuffing request, verify container exists and belongs to customer
        if (req.body.type === "destuffing" && req.body.containerId) {
            const container = await this.getContainerById.execute(req.body.containerId);
            if (!container) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
            }
        }
        const userContext = (0, userContext_1.extractUserContext)(req);
        // Overwrite userId if customer is specified in body but context says unknown (for admin creation)
        if (req.user?.role === 'admin' && req.body.customerId) {
            userContext.targetCustomerId = req.body.customerId;
        }
        const result = await this.createContainerRequest.execute({
            ...req.body,
            customerId,
        }, userContext);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(result, ResponseMessage_1.ResponseMessage.REQUEST_CREATED));
    });
    getMyRequests = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const customerId = req.user?.id;
        if (!customerId) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const results = await this.getCustomerRequests.execute(customerId);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(results));
    });
    getAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const results = await this.getAllContainerRequests.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(results));
    });
    update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const userContext = (0, userContext_1.extractUserContext)(req);
        // Customers can only mark their OWN requests as "completed"
        if (req.user?.role === "customer") {
            const allowedKeys = ["status"];
            const hasDisallowedFields = Object.keys(data).some(k => !allowedKeys.includes(k));
            if (hasDisallowedFields || data.status !== "completed") {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.FORBIDDEN_COMPLETE_ONLY, HttpStatus_1.HttpStatus.FORBIDDEN);
            }
            const existing = await this.getContainerRequestById.execute(id);
            if (!existing) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_REQUEST_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
            }
            if (existing.customerId !== req.user.id) {
                throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.FORBIDDEN_OWN_ONLY, HttpStatus_1.HttpStatus.FORBIDDEN);
            }
        }
        const updated = await this.updateContainerRequest.execute(id, data, userContext);
        if (!updated) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.CONTAINER_REQUEST_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updated, ResponseMessage_1.ResponseMessage.REQUEST_UPDATED));
    });
}
exports.ContainerRequestController = ContainerRequestController;
//# sourceMappingURL=ContainerRequestController.js.map