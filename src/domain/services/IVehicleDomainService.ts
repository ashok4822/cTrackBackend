import { Vehicle } from "../entities/Vehicle";

export interface GateInVehicleData {
    vehicleNumber: string;
    driverName: string;
    driverPhone?: string;
    vehicleType?: string;
}

export interface IVehicleDomainService {
    processGateIn(data: GateInVehicleData): Promise<Vehicle>;
    processGateOut(vehicle: Vehicle): Promise<void>;
}
