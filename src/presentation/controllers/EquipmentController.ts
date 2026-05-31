import { Request, Response } from "express";
import { ICreateEquipment } from "../../application/ports/ICreateEquipment";
import { IUpdateEquipment } from "../../application/ports/IUpdateEquipment";
import { IDeleteEquipment } from "../../application/ports/IDeleteEquipment";
import { IGetAllEquipment } from "../../application/ports/IGetAllEquipment";
import { IGetEquipmentHistory } from "../../application/ports/IGetEquipmentHistory";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class EquipmentController {
    constructor(
        private readonly _createEquipment: ICreateEquipment,
        private readonly _updateEquipment: IUpdateEquipment,
        private readonly _deleteEquipment: IDeleteEquipment,
        private readonly _getAllEquipment: IGetAllEquipment,
        private readonly _getEquipmentHistory: IGetEquipmentHistory
    ) { }

    fetchAll = asyncHandler(async (req: Request, res: Response) => {
        const filters = req.query as {
            type?: string;
            status?: string;
            name?: string;
        };
        const equipment = await this._getAllEquipment.execute(filters);
        return res.status(HttpStatus.OK).json(ApiResponse.success(equipment));
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const performedBy = req.user?.name || req.user?.email || "System";
        const equipment = await this._createEquipment.execute(req.body, performedBy);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(equipment, ResponseMessage.EQUIPMENT_CREATED));
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const performedBy = req.user?.name || req.user?.email || "System";
        const equipment = await this._updateEquipment.execute(id as string, req.body, performedBy);
        return res.status(HttpStatus.OK).json(ApiResponse.success(equipment, ResponseMessage.EQUIPMENT_UPDATED));
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this._deleteEquipment.execute(id as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.EQUIPMENT_DELETED));
    });

    fetchHistory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const history = await this._getEquipmentHistory.execute(id as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(history));
    });
}


