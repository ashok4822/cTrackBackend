"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRequest = void 0;
class ContainerRequest {
    id;
    customerId;
    type;
    status;
    cargoCategoryId;
    cargoCategoryName;
    containerSize;
    containerType;
    cargoDescription;
    cargoWeight;
    preferredDate;
    specialInstructions;
    isHazardous;
    hazardClass;
    unNumber;
    packingGroup;
    containerId;
    containerNumber;
    remarks;
    checkpoints;
    cargoCharge;
    createdAt;
    updatedAt;
    customerName;
    constructor(id, customerId, type, status, cargoCategoryId, cargoCategoryName, 
    // Stuffing specific fields
    containerSize, containerType, cargoDescription, cargoWeight, preferredDate, specialInstructions, 
    // Hazardous classification
    isHazardous, hazardClass, unNumber, packingGroup, 
    // Destuffing specific fields
    containerId, containerNumber, remarks, checkpoints, cargoCharge, createdAt, updatedAt, 
    // Populated via aggregate join (not persisted in DB)
    customerName) {
        this.id = id;
        this.customerId = customerId;
        this.type = type;
        this.status = status;
        this.cargoCategoryId = cargoCategoryId;
        this.cargoCategoryName = cargoCategoryName;
        this.containerSize = containerSize;
        this.containerType = containerType;
        this.cargoDescription = cargoDescription;
        this.cargoWeight = cargoWeight;
        this.preferredDate = preferredDate;
        this.specialInstructions = specialInstructions;
        this.isHazardous = isHazardous;
        this.hazardClass = hazardClass;
        this.unNumber = unNumber;
        this.packingGroup = packingGroup;
        this.containerId = containerId;
        this.containerNumber = containerNumber;
        this.remarks = remarks;
        this.checkpoints = checkpoints;
        this.cargoCharge = cargoCharge;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customerName = customerName;
    }
}
exports.ContainerRequest = ContainerRequest;
//# sourceMappingURL=ContainerRequest.js.map