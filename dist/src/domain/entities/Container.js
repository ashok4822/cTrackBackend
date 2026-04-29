"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
class Container {
    id;
    containerNumber;
    size;
    type;
    status;
    shippingLine;
    empty;
    movementType;
    customer;
    customerName;
    yardLocation;
    gateInTime;
    gateOutTime;
    dwellTime;
    weight;
    cargoWeight;
    cargoDescription;
    hazardousClassification;
    sealNumber;
    damaged;
    damageDetails;
    blacklisted;
    cargoCategory;
    createdAt;
    updatedAt;
    constructor(id, containerNumber, size, type, status, shippingLine, empty, movementType, customer, customerName, yardLocation, gateInTime, gateOutTime, dwellTime, weight, cargoWeight, cargoDescription, hazardousClassification, sealNumber, damaged, damageDetails, blacklisted, cargoCategory, createdAt, updatedAt) {
        this.id = id;
        this.containerNumber = containerNumber;
        this.size = size;
        this.type = type;
        this.status = status;
        this.shippingLine = shippingLine;
        this.empty = empty;
        this.movementType = movementType;
        this.customer = customer;
        this.customerName = customerName;
        this.yardLocation = yardLocation;
        this.gateInTime = gateInTime;
        this.gateOutTime = gateOutTime;
        this.dwellTime = dwellTime;
        this.weight = weight;
        this.cargoWeight = cargoWeight;
        this.cargoDescription = cargoDescription;
        this.hazardousClassification = hazardousClassification;
        this.sealNumber = sealNumber;
        this.damaged = damaged;
        this.damageDetails = damageDetails;
        this.blacklisted = blacklisted;
        this.cargoCategory = cargoCategory;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    update(data) {
        return new Container(this.id, data.containerNumber !== undefined ? data.containerNumber : this.containerNumber, data.size !== undefined ? data.size : this.size, data.type !== undefined ? data.type : this.type, data.status !== undefined ? data.status : this.status, data.shippingLine !== undefined ? data.shippingLine : this.shippingLine, data.empty !== undefined ? data.empty : this.empty, data.movementType !== undefined ? data.movementType : this.movementType, data.customer !== undefined ? data.customer : this.customer, this.customerName, data.yardLocation !== undefined ? data.yardLocation : this.yardLocation, data.gateInTime !== undefined ? data.gateInTime : this.gateInTime, data.gateOutTime !== undefined ? data.gateOutTime : this.gateOutTime, data.dwellTime !== undefined ? data.dwellTime : this.dwellTime, data.weight !== undefined ? data.weight : this.weight, data.cargoWeight !== undefined ? data.cargoWeight : this.cargoWeight, data.cargoDescription !== undefined ? data.cargoDescription : this.cargoDescription, data.hazardousClassification !== undefined ? data.hazardousClassification : this.hazardousClassification, data.sealNumber !== undefined ? data.sealNumber : this.sealNumber, data.damaged !== undefined ? data.damaged : this.damaged, data.damageDetails !== undefined ? data.damageDetails : this.damageDetails, data.blacklisted !== undefined ? data.blacklisted : this.blacklisted, data.cargoCategory !== undefined ? data.cargoCategory : this.cargoCategory, this.createdAt, new Date());
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map