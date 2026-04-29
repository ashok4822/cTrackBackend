"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehicle = void 0;
const VehicleMapper_1 = require("../mappers/VehicleMapper");
class CreateVehicle {
    vehicleRepository;
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async execute(data) {
        const existingVehicles = await this.vehicleRepository.findAll({ vehicleNumber: data.vehicleNumber });
        const existingVehicle = existingVehicles.find((v) => v.vehicleNumber.toLowerCase() === data.vehicleNumber.toLowerCase());
        if (existingVehicle) {
            // Logic: if already exists, update info and status via re-entry
            const updatedVehicle = VehicleMapper_1.VehicleMapper.applyReEntry(existingVehicle, data);
            const saved = await this.vehicleRepository.save(updatedVehicle);
            return VehicleMapper_1.VehicleMapper.toResponseDto(saved);
        }
        const vehicle = VehicleMapper_1.VehicleMapper.toEntity(data);
        const saved = await this.vehicleRepository.save(vehicle);
        return VehicleMapper_1.VehicleMapper.toResponseDto(saved);
    }
}
exports.CreateVehicle = CreateVehicle;
//# sourceMappingURL=CreateVehicle.js.map