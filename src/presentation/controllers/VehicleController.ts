import { Request, Response } from "express";
import { ICreateVehicle } from "../../application/ports/ICreateVehicle";
import { IUpdateVehicle } from "../../application/ports/IUpdateVehicle";
import { IDeleteVehicle } from "../../application/ports/IDeleteVehicle";
import { IGetAllVehicles } from "../../application/ports/IGetAllVehicles";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class VehicleController {
    constructor(
        private readonly _createVehicle: ICreateVehicle,
        private readonly _updateVehicle: IUpdateVehicle,
        private readonly _deleteVehicle: IDeleteVehicle,
        private readonly _getAllVehicles: IGetAllVehicles
    ) { }

    fetchAll = asyncHandler(async (req: Request, res: Response) => {
        const filters = req.query as {
            type?: string;
            vehicleNumber?: string;
        };
        const vehicles = await this._getAllVehicles.execute(filters);
        return res.status(HttpStatus.OK).json(ApiResponse.success(vehicles));
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const vehicle = await this._createVehicle.execute(req.body);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(vehicle, ResponseMessage.VEHICLE_CREATED));
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const vehicle = await this._updateVehicle.execute(id as string, req.body);
        return res.status(HttpStatus.OK).json(ApiResponse.success(vehicle, ResponseMessage.VEHICLE_UPDATED));
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this._deleteVehicle.execute(id as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.VEHICLE_DELETED));
    });
}


