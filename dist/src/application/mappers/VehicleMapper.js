"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleMapper = void 0;
const Vehicle_1 = require("../../domain/entities/Vehicle");
class VehicleMapper {
    static toEntity(dto) {
        return new Vehicle_1.Vehicle(undefined, dto.vehicleNumber, dto.driverName, dto.driverPhone, dto.type, "out-of-yard", dto.gpsDeviceId, dto.currentLocation);
    }
    /** Apply an update to an existing Vehicle entity */
    static applyUpdate(existing, data) {
        return new Vehicle_1.Vehicle(existing.id, data.vehicleNumber ?? existing.vehicleNumber, data.driverName ?? existing.driverName, data.driverPhone ?? existing.driverPhone, data.type ?? existing.type, existing.status, data.gpsDeviceId ?? existing.gpsDeviceId, data.currentLocation ?? existing.currentLocation);
    }
    /** Re-register an existing Vehicle on yard re-entry */
    static applyReEntry(existing, data) {
        return new Vehicle_1.Vehicle(existing.id, data.vehicleNumber, data.driverName, data.driverPhone, data.type, "in-yard", data.gpsDeviceId || existing.gpsDeviceId, data.currentLocation || "Gate In", existing.createdAt, new Date());
    }
    static toResponseDto(vehicle) {
        return {
            id: vehicle.id,
            vehicleNumber: vehicle.vehicleNumber,
            driverName: vehicle.driverName,
            driverPhone: vehicle.driverPhone,
            type: vehicle.type,
            status: vehicle.status,
            gpsDeviceId: vehicle.gpsDeviceId,
            currentLocation: vehicle.currentLocation,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
        };
    }
    static toCollectionResponseDto(vehicles) {
        return {
            items: vehicles.map(v => this.toResponseDto(v)),
            total: vehicles.length,
        };
    }
}
exports.VehicleMapper = VehicleMapper;
//# sourceMappingURL=VehicleMapper.js.map