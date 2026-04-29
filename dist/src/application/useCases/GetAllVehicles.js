"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllVehicles = void 0;
const VehicleMapper_1 = require("../mappers/VehicleMapper");
class GetAllVehicles {
    vehicleRepository;
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async execute(filters) {
        const vehicles = await this.vehicleRepository.findAll(filters);
        return VehicleMapper_1.VehicleMapper.toCollectionResponseDto(vehicles);
    }
}
exports.GetAllVehicles = GetAllVehicles;
//# sourceMappingURL=GetAllVehicles.js.map