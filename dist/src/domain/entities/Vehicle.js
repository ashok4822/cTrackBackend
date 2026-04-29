"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
class Vehicle {
    id;
    vehicleNumber;
    driverName;
    driverPhone;
    type;
    status;
    gpsDeviceId;
    currentLocation;
    createdAt;
    updatedAt;
    constructor(id, vehicleNumber, driverName, driverPhone, type, status = "out-of-yard", gpsDeviceId, currentLocation, createdAt, updatedAt) {
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.type = type;
        this.status = status;
        this.gpsDeviceId = gpsDeviceId;
        this.currentLocation = currentLocation;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Vehicle = Vehicle;
//# sourceMappingURL=Vehicle.js.map