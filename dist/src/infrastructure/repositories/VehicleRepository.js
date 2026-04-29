"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const Vehicle_1 = require("../../domain/entities/Vehicle");
const VehicleModel_1 = require("../models/VehicleModel");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class VehicleRepository {
    async findAll(filters) {
        const query = {};
        if (filters?.type)
            query.type = filters.type;
        if (filters?.status)
            query.status = filters.status;
        if (filters?.vehicleNumber) {
            query.vehicleNumber = { $regex: `^${filters.vehicleNumber}$`, $options: "i" };
        }
        const vehicles = await VehicleModel_1.VehicleModel.find(query);
        return vehicles.map(this.toEntity);
    }
    async findById(id) {
        const vehicle = await VehicleModel_1.VehicleModel.findById(id);
        if (!vehicle)
            return null;
        return this.toEntity(vehicle);
    }
    async save(vehicle) {
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
            const updated = await VehicleModel_1.VehicleModel.findByIdAndUpdate(vehicle.id, data, {
                new: true,
            });
            if (!updated)
                throw new Error(ResponseMessage_1.ResponseMessage.VEHICLE_NOT_FOUND);
            return this.toEntity(updated);
        }
        else {
            const newVehicle = new VehicleModel_1.VehicleModel(data);
            const saved = await newVehicle.save();
            return this.toEntity(saved);
        }
    }
    async delete(id) {
        await VehicleModel_1.VehicleModel.findByIdAndDelete(id);
    }
    toEntity(v) {
        const id = v._id ? v._id.toString() : "";
        return new Vehicle_1.Vehicle(id, v.vehicleNumber, v.driverName, v.driverPhone, v.type, v.status, v.gpsDeviceId, v.currentLocation, v.createdAt, v.updatedAt);
    }
}
exports.VehicleRepository = VehicleRepository;
//# sourceMappingURL=VehicleRepository.js.map