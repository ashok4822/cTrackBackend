import { Request, Response } from "express";
import { CreateVehicle } from "../../application/useCases/CreateVehicle";
import { UpdateVehicle } from "../../application/useCases/UpdateVehicle";
import { DeleteVehicle } from "../../application/useCases/DeleteVehicle";
import { GetAllVehicles } from "../../application/useCases/GetAllVehicles";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class VehicleController {
    constructor(
        private createVehicle: CreateVehicle,
        private updateVehicle: UpdateVehicle,
        private deleteVehicle: DeleteVehicle,
        private getAllVehicles: GetAllVehicles
    ) { }

    async fetchAll(req: Request, res: Response) {
        try {
            const filters = req.query as {
                type?: string;
                vehicleNumber?: string;
            };
            const vehicles = await this.getAllVehicles.execute(filters);
            res.status(HttpStatus.OK).json(vehicles);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Internal Server Error";
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const vehicle = await this.createVehicle.execute(req.body);
            res.status(HttpStatus.CREATED).json(vehicle);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to create vehicle";
            res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vehicle = await this.updateVehicle.execute(id as string, req.body);
            res.status(HttpStatus.OK).json(vehicle);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to update vehicle";
            res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deleteVehicle.execute(id as string);
            res.status(HttpStatus.OK).json({ message: "Vehicle deleted" });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to delete vehicle";
            res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }
}
