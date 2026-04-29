"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleDomainService = void 0;
const Vehicle_1 = require("../../domain/entities/Vehicle");
class VehicleDomainService {
    vehicleRepository;
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async processGateIn(data) {
        const vehicles = await this.vehicleRepository.findAll({
            vehicleNumber: data.vehicleNumber,
        });
        const vehicle = vehicles.length > 0 ? vehicles[0] : null;
        const vehicleData = {
            vehicleNumber: data.vehicleNumber,
            driverName: data.driverName,
            driverPhone: data.driverPhone || (vehicle ? vehicle.driverPhone : "Unknown"),
            type: data.vehicleType || (vehicle ? vehicle.type : "truck"),
            status: "in-yard",
            currentLocation: "Yard Entrance",
        };
        if (vehicle) {
            const vehicleEntity = new Vehicle_1.Vehicle(vehicle.id, vehicleData.vehicleNumber, vehicleData.driverName, vehicleData.driverPhone, vehicleData.type, vehicleData.status, vehicle.gpsDeviceId, vehicleData.currentLocation, vehicle.createdAt, new Date());
            await this.vehicleRepository.save(vehicleEntity);
            return vehicleEntity;
        }
        else {
            const newVehicle = new Vehicle_1.Vehicle(undefined, vehicleData.vehicleNumber, vehicleData.driverName, vehicleData.driverPhone, vehicleData.type, vehicleData.status, undefined, vehicleData.currentLocation);
            await this.vehicleRepository.save(newVehicle);
            return newVehicle;
        }
    }
    async processGateOut(vehicle) {
        const updatedVehicle = new Vehicle_1.Vehicle(vehicle.id, vehicle.vehicleNumber, vehicle.driverName, vehicle.driverPhone, vehicle.type, "out-of-yard", vehicle.gpsDeviceId, "Exited", vehicle.createdAt, new Date());
        await this.vehicleRepository.save(updatedVehicle);
    }
}
exports.VehicleDomainService = VehicleDomainService;
//# sourceMappingURL=VehicleDomainService.js.map