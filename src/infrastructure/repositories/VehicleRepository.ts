import { IVehicleRepository, VehicleFilters } from "../../domain/repositories/IVehicleRepository";
import { Vehicle } from "../../domain/entities/Vehicle";
import { VehicleModel } from "../models/VehicleModel";

export class VehicleRepository implements IVehicleRepository {
    async findAll(filter: VehicleFilters = {}): Promise<Vehicle[]> {
        const mongoFilter: any = {};
        if (filter.type) mongoFilter.type = filter.type;
        if (filter.status) mongoFilter.status = filter.status;
        if (filter.vehicleNumber) {
            mongoFilter.vehicleNumber = { $regex: filter.vehicleNumber, $options: "i" };
        }

        const vehicles = await VehicleModel.find(mongoFilter).sort({ createdAt: -1 });
        return vehicles.map(this.toEntity);
    }

    async findById(id: string): Promise<Vehicle | null> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        const vehicle = await VehicleModel.findById(id);
        if (!vehicle) return null;
        return this.toEntity(vehicle);
    }

    async save(vehicle: Vehicle): Promise<void> {
        const data = {
            vehicleNumber: vehicle.vehicleNumber,
            driverName: vehicle.driverName,
            driverPhone: vehicle.driverPhone,
            type: vehicle.type,
            status: vehicle.status,
            gpsDeviceId: vehicle.gpsDeviceId,
            currentLocation: vehicle.currentLocation,
        };

        if (vehicle.id && vehicle.id.match(/^[0-9a-fA-F]{24}$/)) {
            await VehicleModel.findByIdAndUpdate(vehicle.id, data);
        } else {
            const newVehicle = new VehicleModel(data);
            await newVehicle.save();
        }
    }

    async delete(id: string): Promise<void> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return;
        await VehicleModel.findByIdAndDelete(id);
    }

    private toEntity(doc: any): Vehicle {
        return new Vehicle(
            doc.id,
            doc.vehicleNumber,
            doc.driverName,
            doc.driverPhone,
            doc.type,
            doc.status,
            doc.gpsDeviceId,
            doc.currentLocation,
            doc.createdAt,
            doc.updatedAt
        );
    }
}
