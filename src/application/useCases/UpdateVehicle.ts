import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle, VehicleType } from "../../domain/entities/Vehicle";

export class UpdateVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(
        id: string,
        data: Partial<{
            vehicleNumber: string;
            driverName: string;
            driverPhone: string;
            type: VehicleType;
            gpsDeviceId: string;
            currentLocation: string;
        }>
    ): Promise<Vehicle> {
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error("Vehicle not found");
        }

        const updatedVehicle = new Vehicle(
            id,
            data.vehicleNumber ?? existingVehicle.vehicleNumber,
            data.driverName ?? existingVehicle.driverName,
            data.driverPhone ?? existingVehicle.driverPhone,
            data.type ?? existingVehicle.type,
            existingVehicle.status,
            data.gpsDeviceId ?? existingVehicle.gpsDeviceId,
            data.currentLocation ?? existingVehicle.currentLocation
        );

        return await this.vehicleRepository.save(updatedVehicle);
    }
}
