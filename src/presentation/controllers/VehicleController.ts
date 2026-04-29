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
        private createVehicle: ICreateVehicle,
        private updateVehicle: IUpdateVehicle,
        private deleteVehicle: IDeleteVehicle,
        private getAllVehicles: IGetAllVehicles
    ) { }

    fetchAll = asyncHandler(async (req: Request, res: Response) => {
        const filters = req.query as {
            type?: string;
            vehicleNumber?: string;
        };
        const vehicles = await this.getAllVehicles.execute(filters);
        return res.status(HttpStatus.OK).json(ApiResponse.success(vehicles));
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const vehicle = await this.createVehicle.execute(req.body);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(vehicle, ResponseMessage.VEHICLE_CREATED));
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const vehicle = await this.updateVehicle.execute(id as string, req.body);
        return res.status(HttpStatus.OK).json(ApiResponse.success(vehicle, ResponseMessage.VEHICLE_UPDATED));
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.deleteVehicle.execute(id as string);
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.VEHICLE_DELETED));
    });
}


