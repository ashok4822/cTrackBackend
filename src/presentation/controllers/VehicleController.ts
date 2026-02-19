import { Request, Response } from "express";
import { GetAllVehicles } from "../../application/useCases/GetAllVehicles";
import { AddVehicle } from "../../application/useCases/AddVehicle";
import { UpdateVehicle } from "../../application/useCases/UpdateVehicle";
import { DeleteVehicle } from "../../application/useCases/DeleteVehicle";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class VehicleController {
    constructor(
        private getAllVehiclesUseCase: GetAllVehicles,
        private addVehicleUseCase: AddVehicle,
        private updateVehicleUseCase: UpdateVehicle,
        private deleteVehicleUseCase: DeleteVehicle
    ) { }

    async getAllVehicles(req: Request, res: Response) {
        try {
            const { type, status, vehicleNumber } = req.query;
            const vehicles = await this.getAllVehiclesUseCase.execute({
                type: type as any,
                status: status as any,
                vehicleNumber: vehicleNumber as string,
            });
            return res.status(HttpStatus.OK).json(vehicles);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async addVehicle(req: Request, res: Response) {
        try {
            await this.addVehicleUseCase.execute(req.body);
            return res.status(HttpStatus.CREATED).json({ message: "Vehicle added successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async updateVehicle(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await this.updateVehicleUseCase.execute(id, req.body);
            return res.status(HttpStatus.OK).json({ message: "Vehicle updated successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async deleteVehicle(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await this.deleteVehicleUseCase.execute(id);
            return res.status(HttpStatus.OK).json({ message: "Vehicle deleted successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
