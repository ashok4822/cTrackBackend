"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateOperation = void 0;
class GateOperation {
    id;
    type;
    containerNumber;
    vehicleNumber;
    driverName;
    purpose;
    timestamp;
    approvedBy;
    remarks;
    cargoCategory;
    constructor(id, type, containerNumber, vehicleNumber, driverName, purpose, timestamp, approvedBy, remarks, cargoCategory) {
        this.id = id;
        this.type = type;
        this.containerNumber = containerNumber;
        this.vehicleNumber = vehicleNumber;
        this.driverName = driverName;
        this.purpose = purpose;
        this.timestamp = timestamp;
        this.approvedBy = approvedBy;
        this.remarks = remarks;
        this.cargoCategory = cargoCategory;
    }
}
exports.GateOperation = GateOperation;
//# sourceMappingURL=GateOperation.js.map