import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../domain/entities/Vehicle";

export class GetAllVehicles {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(filters?: {
        type?: string;
        vehicleNumber?: string;
        status?: string;
    }): Promise<Vehicle[]> {
        return await this.vehicleRepository.findAll(filters);
    }
}
