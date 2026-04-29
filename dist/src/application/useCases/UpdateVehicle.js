"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicle = void 0;
const VehicleMapper_1 = require("../mappers/VehicleMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateVehicle {
    vehicleRepository;
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async execute(id, data) {
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.VEHICLE_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const updatedVehicle = VehicleMapper_1.VehicleMapper.applyUpdate(existingVehicle, data);
        const saved = await this.vehicleRepository.save(updatedVehicle);
        return VehicleMapper_1.VehicleMapper.toResponseDto(saved);
    }
}
exports.UpdateVehicle = UpdateVehicle;
//# sourceMappingURL=UpdateVehicle.js.map