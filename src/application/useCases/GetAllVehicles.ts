import { IVehicleRepository, VehicleFilters } from "../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../domain/entities/Vehicle";

export class GetAllVehicles {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(filter?: VehicleFilters): Promise<Vehicle[]> {
        return await this.vehicleRepository.findAll(filter);
    }
}
