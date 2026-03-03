import { Vehicle } from "../entities/Vehicle";

export interface IVehicleRepository {
    findAll(filters?: {
        type?: string;
        vehicleNumber?: string;
        status?: string;
    }): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
    save(vehicle: Vehicle): Promise<Vehicle>;
    delete(id: string): Promise<void>;
}
