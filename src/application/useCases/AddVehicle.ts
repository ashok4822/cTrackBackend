import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../domain/entities/Vehicle";

export class AddVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(vehicleData: Omit<Vehicle, "id">): Promise<void> {
        const vehicle = new Vehicle(
            null,
            vehicleData.vehicleNumber,
            vehicleData.driverName,
            vehicleData.driverPhone,
            vehicleData.type,
            vehicleData.status,
            vehicleData.gpsDeviceId,
            vehicleData.currentLocation
        );
        await this.vehicleRepository.save(vehicle);
    }
}
