"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateMapper = void 0;
const GateOperation_1 = require("../../domain/entities/GateOperation");
class GateMapper {
    static toEntity(dto, approvedBy) {
        return new GateOperation_1.GateOperation(null, dto.type, dto.containerNumber, dto.vehicleNumber, dto.driverName, dto.purpose, new Date(), approvedBy, dto.remarks, dto.cargoCategory);
    }
    static toResponseDto(operation) {
        return {
            id: operation.id,
            type: operation.type,
            containerNumber: operation.containerNumber,
            vehicleNumber: operation.vehicleNumber,
            driverName: operation.driverName,
            purpose: operation.purpose,
            timestamp: operation.timestamp,
            approvedBy: operation.approvedBy,
            remarks: operation.remarks,
            cargoCategory: operation.cargoCategory,
        };
    }
    static toCollectionResponseDto(operations) {
        return {
            items: operations.map(op => this.toResponseDto(op)),
            total: operations.length,
        };
    }
}
exports.GateMapper = GateMapper;
//# sourceMappingURL=GateMapper.js.map