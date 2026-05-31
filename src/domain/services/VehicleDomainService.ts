import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle, VehicleType } from "../../domain/entities/Vehicle";

import { IVehicleDomainService, GateInVehicleData } from "./IVehicleDomainService";

export class VehicleDomainService implements IVehicleDomainService {
  constructor(private readonly _vehicleRepository: IVehicleRepository) {}

  async processGateIn(data: GateInVehicleData): Promise<Vehicle> {
    const vehicles = await this._vehicleRepository.findAll({
      vehicleNumber: data.vehicleNumber,
    });
    const vehicle = vehicles.length > 0 ? vehicles[0] : null;

    const vehicleData = {
      vehicleNumber: data.vehicleNumber,
      driverName: data.driverName,
      driverPhone: data.driverPhone || (vehicle ? vehicle.driverPhone : "Unknown"),
      type: (data.vehicleType as VehicleType) || (vehicle ? vehicle.type : "truck"),
      status: "in-yard" as const,
      currentLocation: "Yard Entrance",
    };

    if (vehicle) {
      const vehicleEntity = new Vehicle(
        vehicle.id,
        vehicleData.vehicleNumber,
        vehicleData.driverName,
        vehicleData.driverPhone,
        vehicleData.type,
        vehicleData.status,
        vehicle.gpsDeviceId,
        vehicleData.currentLocation,
        vehicle.createdAt,
        new Date()
      );
      await this._vehicleRepository.save(vehicleEntity);
      return vehicleEntity;
    } else {
      const newVehicle = new Vehicle(
        undefined,
        vehicleData.vehicleNumber,
        vehicleData.driverName,
        vehicleData.driverPhone,
        vehicleData.type,
        vehicleData.status,
        undefined,
        vehicleData.currentLocation
      );
      await this._vehicleRepository.save(newVehicle);
      return newVehicle;
    }
  }

  async processGateOut(vehicle: Vehicle): Promise<void> {
    const updatedVehicle = new Vehicle(
      vehicle.id,
      vehicle.vehicleNumber,
      vehicle.driverName,
      vehicle.driverPhone,
      vehicle.type,
      "out-of-yard",
      vehicle.gpsDeviceId,
      "Exited",
      vehicle.createdAt,
      new Date()
    );
    await this._vehicleRepository.save(updatedVehicle);
  }
}
