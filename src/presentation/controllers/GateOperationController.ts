import { Request, Response } from "express";
import { IGetGateOperations } from "../../application/ports/IGetGateOperations";
import { ICreateGateOperation } from "../../application/ports/ICreateGateOperation";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { extractUserContext } from "../utils/userContext";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class GateOperationController {
    constructor(
        private readonly _getGateOperationsUseCase: IGetGateOperations,
        private readonly _createGateOperationUseCase: ICreateGateOperation
    ) { }

    getGateOperations = asyncHandler(async (req: Request, res: Response) => {
        const filters = req.query as {
            type?: "gate-in" | "gate-out";
            containerNumber?: string;
            vehicleNumber?: string;
            limit?: string;
            status?: string;
        };
        const operations = await this._getGateOperationsUseCase.execute({
            ...filters,
            limit: filters.limit ? parseInt(filters.limit, 10) : undefined
        });
        return res.status(HttpStatus.OK).json(ApiResponse.success(operations));
    });

    createGateOperation = asyncHandler(async (req: Request, res: Response) => {
        const performedBy = req.user?.name || req.user?.email || "System";
        const userContext = extractUserContext(req);
        await this._createGateOperationUseCase.execute(req.body, userContext, performedBy);
        
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(null, ResponseMessage.GATE_OPERATION_SUCCESS));
    });
}

