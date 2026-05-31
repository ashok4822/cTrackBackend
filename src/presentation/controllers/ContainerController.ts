import { Request, Response } from "express";
import { ICreateContainer } from "../../application/ports/ICreateContainer";
import { IGetAllContainers } from "../../application/ports/IGetAllContainers";
import { ContainerFiltersDto } from "../../application/dto/ContainerDto";
import { IGetContainerById } from "../../application/ports/IGetContainerById";
import { IUpdateContainer } from "../../application/ports/IUpdateContainer";
import { IBlacklistContainer } from "../../application/ports/IBlacklistContainer";
import { IUnblacklistContainer } from "../../application/ports/IUnblacklistContainer";
import { IGetContainerHistory } from "../../application/ports/IGetContainerHistory";
import { IGetCustomerContainers } from "../../application/ports/IGetCustomerContainers";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AppError } from "../../domain/exceptions/AppError";
import { extractUserContext } from "../utils/userContext";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class ContainerController {
    constructor(
        private readonly _createContainerUseCase: ICreateContainer,
        private readonly _getAllContainersUseCase: IGetAllContainers,
        private readonly _getContainerByIdUseCase: IGetContainerById,
        private readonly _updateContainerUseCase: IUpdateContainer,
        private readonly _blacklistContainerUseCase: IBlacklistContainer,
        private readonly _unblacklistContainerUseCase: IUnblacklistContainer,
        private readonly _getContainerHistoryUseCase: IGetContainerHistory,
        private readonly _getCustomerContainersUseCase: IGetCustomerContainers
    ) { }

    createContainer = asyncHandler(async (req: Request, res: Response) => {
        const userContext = extractUserContext(req);
        await this._createContainerUseCase.execute(req.body, userContext);
        
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(null, ResponseMessage.CONTAINER_CREATED));
    });

    getAllContainers = asyncHandler(async (req: Request, res: Response) => {
        const filters = req.query as unknown as ContainerFiltersDto;
        const containers = await this._getAllContainersUseCase.execute(filters);
        return res.status(HttpStatus.OK).json(ApiResponse.success(containers));
    });

    getContainerById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const container = await this._getContainerByIdUseCase.execute(id as string);
        if (!container) {
            throw new AppError(ResponseMessage.CONTAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return res.status(HttpStatus.OK).json(ApiResponse.success(container));
    });

    updateContainer = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { equipment: equipmentName, ...data } = req.body;
        const performedBy = req.user?.name || req.user?.email || "System";
        const userContext = extractUserContext(req);
        await this._updateContainerUseCase.execute({ id, equipmentName, performedBy, ...data }, userContext);
        
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.CONTAINER_UPDATED));
    });

    blacklistContainer = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userContext = extractUserContext(req);
        await this._blacklistContainerUseCase.execute(id as string, userContext);
        
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.CONTAINER_BLACKLISTED));
    });

    unblacklistContainer = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userContext = extractUserContext(req);
        await this._unblacklistContainerUseCase.execute(id as string, userContext);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.CONTAINER_UNBLACKLISTED));
    });

    getContainerHistory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const history = await this._getContainerHistoryUseCase.execute(id as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(history));
    });

    getCustomerContainers = asyncHandler(async (req: Request, res: Response) => {
        const customerName = req.user?.name;
        const customerId = req.user?.id;
        if (!customerName || !customerId) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        const containers = await this._getCustomerContainersUseCase.execute(customerName, customerId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(containers));
    });
}


