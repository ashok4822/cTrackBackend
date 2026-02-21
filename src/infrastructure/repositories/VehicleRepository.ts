import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { Vehicle, VehicleType } from "../../domain/entities/Vehicle";
import { VehicleModel, IVehicleDocument } from "../models/VehicleModel";

export class VehicleRepository implements IVehicleRepository {
    async findAll(filters?: {
        type?: string;
        vehicleNumber?: string;
    }): Promise<Vehicle[]> {
        const query: Record<string, string | { $regex: string; $options: string }> = {};
        if (filters?.type) query.type = filters.type;
        if (filters?.vehicleNumber) {
            query.vehicleNumber = { $regex: `^${filters.vehicleNumber}$`, $options: "i" };
        }

        const vehicles = await VehicleModel.find(query);
        return vehicles.map(this.toEntity);
    }

    async findById(id: string): Promise<Vehicle | null> {
        const vehicle = await VehicleModel.findById(id);
        if (!vehicle) return null;
        return this.toEntity(vehicle);
    }

    async save(vehicle: Vehicle): Promise<Vehicle> {
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
            const updated = await VehicleModel.findByIdAndUpdate(vehicle.id, data, {
                new: true,
            });
            if (!updated) throw new Error("Vehicle not found for update");
            return this.toEntity(updated);
        } else {
            const newVehicle = new VehicleModel(data);
            const saved = await newVehicle.save();
            return this.toEntity(saved);
        }
    }

    async delete(id: string): Promise<void> {
        await VehicleModel.findByIdAndDelete(id);
    }

    private toEntity(v: IVehicleDocument): Vehicle {
        const id = v._id ? v._id.toString() : "";
        return new Vehicle(
            id,
            v.vehicleNumber,
            v.driverName,
            v.driverPhone,
            v.type as VehicleType,
            v.status as "in-yard" | "out-of-yard",
            v.gpsDeviceId,
            v.currentLocation,
            v.createdAt,
            v.updatedAt
        );
    }
}
