import { Request, Response } from "express";
import { ICreateContainerRequest } from "../../application/ports/ICreateContainerRequest";
import { IGetCustomerRequests } from "../../application/ports/IGetCustomerRequests";
import { IGetContainerById } from "../../application/ports/IGetContainerById";
import { IGetAllContainerRequests } from "../../application/ports/IGetAllContainerRequests";
import { IUpdateContainerRequest } from "../../application/ports/IUpdateContainerRequest";
import { IGetContainerRequestById } from "../../application/ports/IGetContainerRequestById";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AppError } from "../../domain/exceptions/AppError";
import { extractUserContext } from "../utils/userContext";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class ContainerRequestController {
    constructor(
        private readonly _createContainerRequest: ICreateContainerRequest,
        private readonly _getCustomerRequests: IGetCustomerRequests,
        private readonly _getContainerById: IGetContainerById,
        private readonly _getAllContainerRequests: IGetAllContainerRequests,
        private readonly _updateContainerRequest: IUpdateContainerRequest,
        private readonly _getContainerRequestById: IGetContainerRequestById
    ) { }

    create = asyncHandler(async (req: Request, res: Response) => {
        const customerId = req.user?.id || req.body.customerId;
        if (!customerId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        // If it's a destuffing request, verify container exists and belongs to customer
        if (req.body.type === "destuffing" && req.body.containerId) {
            const container = await this._getContainerById.execute(req.body.containerId);
            if (!container) {
                throw new AppError(ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        }

        const userContext = extractUserContext(req);
        // Overwrite userId if customer is specified in body but context says unknown (for admin creation)
        if (req.user?.role === 'admin' && req.body.customerId) {
            userContext.targetCustomerId = req.body.customerId;
        }

        const result = await this._createContainerRequest.execute({
            ...req.body,
            customerId,
        }, userContext);

        return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, ResponseMessage.REQUEST_CREATED));
    });

    getMyRequests = asyncHandler(async (req: Request, res: Response) => {
        const customerId = req.user?.id;
        if (!customerId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const results = await this._getCustomerRequests.execute(customerId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(results));
    });

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const results = await this._getAllContainerRequests.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(results));
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;

        const userContext = extractUserContext(req);

        // Customers can only mark their OWN requests as "completed"
        if (req.user?.role === "customer") {
            const allowedKeys = ["status"];
            const hasDisallowedFields = Object.keys(data).some(k => !allowedKeys.includes(k));
            if (hasDisallowedFields || data.status !== "completed") {
                throw new AppError(ResponseMessage.FORBIDDEN_COMPLETE_ONLY, HttpStatus.FORBIDDEN);
            }

            const existing = await this._getContainerRequestById.execute(id as string);
            if (!existing) {
                throw new AppError(ResponseMessage.CONTAINER_REQUEST_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            if (existing.customerId !== req.user.id) {
                throw new AppError(ResponseMessage.FORBIDDEN_OWN_ONLY, HttpStatus.FORBIDDEN);
            }
        }

        const updated = await this._updateContainerRequest.execute(id as string, data, userContext);

        if (!updated) {
            throw new AppError(ResponseMessage.CONTAINER_REQUEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return res.status(HttpStatus.OK).json(ApiResponse.success(updated, ResponseMessage.REQUEST_UPDATED));
    });
}

