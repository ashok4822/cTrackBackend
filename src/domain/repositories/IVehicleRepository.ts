import { Vehicle } from "../entities/Vehicle";

export interface VehicleFilters {
    type?: "truck" | "trailer" | "chassis";
    status?: "active" | "inactive" | "maintenance";
    vehicleNumber?: string;
}

export interface IVehicleRepository {
    save(vehicle: Vehicle): Promise<void>;
    findAll(filter?: VehicleFilters): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
    delete(id: string): Promise<void>;
}
