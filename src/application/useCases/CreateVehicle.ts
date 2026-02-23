import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle, VehicleType } from "../../domain/entities/Vehicle";

export class CreateVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(data: {
        vehicleNumber: string;
        driverName: string;
        driverPhone: string;
        type: VehicleType;
        status?: "in-yard" | "out-of-yard";
        gpsDeviceId?: string;
        currentLocation?: string;
    }): Promise<Vehicle> {
        const existingVehicles = await this.vehicleRepository.findAll({ vehicleNumber: data.vehicleNumber });
        const existingVehicle = existingVehicles.find(v => v.vehicleNumber.toLowerCase() === data.vehicleNumber.toLowerCase());

        if (existingVehicle) {
            if ((data.status === "in-yard" || !data.status) && existingVehicle.status === "in-yard") {
                throw new Error(`Vehicle ${data.vehicleNumber} is already in the yard`);
            }
            const updatedVehicle = new Vehicle(
                existingVehicle.id,
                data.vehicleNumber,
                data.driverName,
                data.driverPhone,
                data.type,
                data.status || "in-yard",
                data.gpsDeviceId || existingVehicle.gpsDeviceId,
                data.currentLocation || "Gate In",
                existingVehicle.createdAt,
                new Date()
            );
            return await this.vehicleRepository.save(updatedVehicle);
        }

        const vehicle = new Vehicle(
            undefined,
            data.vehicleNumber,
            data.driverName,
            data.driverPhone,
            data.type,
            data.status || "out-of-yard",
            data.gpsDeviceId,
            data.currentLocation
        );
        return await this.vehicleRepository.save(vehicle);
    }
}
