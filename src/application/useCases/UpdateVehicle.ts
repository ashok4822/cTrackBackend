import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../domain/entities/Vehicle";

export class UpdateVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(id: string, vehicleData: Partial<Vehicle>): Promise<void> {
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error("Vehicle not found");
        }

        const updatedVehicle = new Vehicle(
            id,
            vehicleData.vehicleNumber ?? existingVehicle.vehicleNumber,
            vehicleData.driverName ?? existingVehicle.driverName,
            vehicleData.driverPhone ?? existingVehicle.driverPhone,
            vehicleData.type ?? existingVehicle.type,
            vehicleData.status ?? existingVehicle.status,
            vehicleData.gpsDeviceId ?? existingVehicle.gpsDeviceId,
            vehicleData.currentLocation ?? existingVehicle.currentLocation
        );

        await this.vehicleRepository.save(updatedVehicle);
    }
}
